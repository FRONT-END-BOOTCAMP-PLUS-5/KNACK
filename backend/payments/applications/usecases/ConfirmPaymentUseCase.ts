// backend/payments/applications/usecases/ConfirmPaymentUseCase.ts
import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository'
import { CouponRepository } from '@/backend/coupon/domains/repositories/CouponRepository'
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository'
import { TossGateway } from '@/types/payment'
import prisma from '@/backend/utils/prisma'
import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository'
import { CartRepository } from '@/backend/cart/domains/repositories/CartRepository'
import { CardRepository } from '@/types/order'

export class ConfirmPaymentUseCase {
    constructor(
        private readonly payments: PaymentRepository,
        private readonly orders: OrderRepository,
        private readonly coupons: CouponRepository,
        private readonly points: UserPointsRepository,
        private readonly toss: TossGateway,
        private readonly cartRepo: CartRepository,
        private readonly cards?: CardRepository, // optional
    ) { }

    async execute(args: {
        userId: string
        orderId: string              // idempotencyKey for coupon/points
        tossPaymentKey: string
        amount: number
        addressId: number
        orderIds: number[]
        selectedCouponId?: number | null
        pointsToUse?: number | null
        cartIds?: number[]
    }) {
        const {
            userId, orderId, tossPaymentKey, amount,
            addressId, selectedCouponId, pointsToUse, cartIds
        } = args

        // 1) tossPaymentKey로 선점 (동시 처리 차단 + 멱등)
        const claimed = await this.payments.claimByTossKey({ userId, addressId, amount, tossPaymentKey })
        if (claimed.status === 'PAID') {
            // 이미 완료된 결제 → 멱등 반환
            return {
                id: claimed.id, // ✅ payment 테이블 id
                status: 'DONE',
                paymentNumber: claimed.paymentNumber?.toString() ?? null,
                approvedAt: claimed.approvedAt?.toISOString() ?? null,
                method: claimed.method ?? null,
            }
        }

        // 2) 토스 결제 승인 (트랜잭션 바깥)
        const confirm = await this.toss.confirmPayment({ tossPaymentKey, orderId, amount })

        // 3) 트랜잭션으로 원자 처리
        const paid = await prisma.$transaction(async (tx) => {
            // 상태 전이: CONFIRMING -> PAID (경합 시 false)
            const ok = await this.payments.markPaid({
                id: claimed.id,
                method: confirm.method,
                approvedAt: new Date(confirm.approvedAt ?? Date.now()),
                requestedAt: confirm.requestedAt ? new Date(confirm.requestedAt) : undefined,
                tossPaymentKey,
            })
            if (!ok) {
                // 뒤늦은 요청 → 이미 처리된 결과 멱등 반환
                const already = await this.payments.findByTossPaymentKey(tossPaymentKey)
                return already!
            }

            // 주문 연결 (아직 미연결만)
            const linked = await this.orders.linkOrdersToPayment({ orderIds: args.orderIds, paymentId: claimed.id, userId })
            if (linked !== args.orderIds.length) {
                throw new Error('some orders already linked or not owned')
            }


            // ✅ 쿠폰 차감: 트랜잭션 클라이언트(tx) 전달
            if (selectedCouponId) {
                await this.coupons.consumeByDelete(userId, Number(selectedCouponId), tx)
            }

            // 포인트 멱등 차감 (당신의 Repo 시그니처에 맞춰 호출)
            if (pointsToUse && pointsToUse > 0) {
                await this.points.debit({
                    userId,
                    amount: Number(pointsToUse),
                    idempotencyKey: orderId,
                    reason: 'PAYMENT',
                })
            }

            // 카드 정보 저장 (있을 때만)
            if (this.cards && confirm.method === 'CARD' && confirm.card) {
                const c = confirm.card
                await this.cards.save({
                    paymentId: claimed.id,
                    issuerCode: c.issuerCode,
                    acquirerCode: c.acquirerCode,
                    number: c.number,
                    installmentPlanMonths: c.installmentPlanMonths,
                    approveNo: c.approveNo,
                    useCardPoint: c.useCardPoint,
                    isInterestFree: c.isInterestFree,
                })
            }

            // ✅ 장바구니 삭제 (전달된 cartIds 기준)
            if (cartIds && cartIds.length > 0) {
                await this.cartRepo.deleteManyByIdsForUser(userId, cartIds)
            }

            // 갱신된 레코드 반환 (id 포함)
            const refreshed = await this.payments.findByTossPaymentKey(tossPaymentKey)
            return refreshed!
        })

        // ✅ 항상 payment 테이블 id 포함해 반환
        return {
            id: paid.id, // ✅ payment.id
            status: 'DONE',
            paymentNumber: paid.paymentNumber?.toString() ?? null,
            approvedAt: paid.approvedAt?.toISOString() ?? null,
            method: paid.method ?? null,
        }
    }
}
