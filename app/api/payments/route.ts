// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository'
import { PrCouponRepository } from '@/backend/coupon/repositories/PrCouponRepository'
import { PrUserPointsRepository } from '@/backend/points/repositories/PrUserPointsRepository'
import { PrCardRepository } from '@/backend/payments/repositories/PrCardRepository'

import { ConfirmPaymentUseCase } from '@/backend/payments/applications/usecases/ConfirmPaymentUseCase'
import { TossConfirmResult, TossGateway } from '@/types/payment'
import { serverPost } from '@/backend/utils/serverRequester'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.user.id

        const {
            tossPaymentKey, orderId, amount, addressId, orderIds,
            selectedCouponId, pointsToUse
        } = await req.json()

        const tossGateway: TossGateway = {
            async confirmPayment({
                tossPaymentKey, orderId, amount
            }: {
                tossPaymentKey: string; orderId: string; amount: number
            }): Promise<TossConfirmResult> {
                const data = await serverPost('/payments/confirm', { paymentKey: tossPaymentKey, orderId, amount }, 'toss')
                console.log(data);
                return {
                    paymentKey: data.paymentKey,
                    method: data.method,
                    status: data.status,
                    approvedAt: data.approvedAt,
                    requestedAt: data.requestedAt,
                    amount: data.amount,
                    // card 등 부가 필드가 있다면 TossConfirmResult에 포함되도록 타입/리턴 확장
                }
            }
        }

        const usecase = new ConfirmPaymentUseCase(
            new PrPaymentRepository(),
            new PrOrderRepository(),
            new PrCouponRepository(),
            new PrUserPointsRepository(),
            tossGateway,
            new PrCardRepository(),
        )

        const result = await usecase.execute({
            userId,
            orderId,
            tossPaymentKey,
            amount: Number(amount),
            addressId: Number(addressId),
            orderIds: (orderIds as number[]) ?? [],
            selectedCouponId: selectedCouponId ? Number(selectedCouponId) : null,
            pointsToUse: pointsToUse ? Number(pointsToUse) : 0,
        })

        // ✅ id를 포함해 응답을 명시적으로 구성
        return NextResponse.json({
            id: result.id,                                  // payment 테이블 id
            status: result.status,
            paymentNumber: result.paymentNumber ?? null,
            approvedAt: result.approvedAt ?? null,
            method: result.method ?? null,
            orderIds,
            amount: Number(amount),
        }, { status: 201 })
    } catch (e) {
        console.error('[POST /api/payments] failed:', e)
        return NextResponse.json(
            { message: (e as Error).message ?? '결제 승인 실패' },
            { status: 400 }
        )
    }
}
