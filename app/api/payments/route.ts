import { NextRequest, NextResponse } from 'next/server'
import { serverPost as tossPOST } from '@/backend/utils/serverRequester'
import type { AxiosError } from 'axios'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository'
import { PrCardRepository } from '@/backend/payments/repositories/PrCardRepository'
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto'
import { CreateCardDto } from '@/backend/payments/applications/dtos/CreateCardDto'
import { GetPaymentDto } from '@/backend/payments/applications/dtos/GetPaymentDto'
import { PrCouponRepository } from '@/backend/coupon/repositories/PrCouponRepository'
import { PrUserPointsRepository } from '@/backend/points/repositories/PrUserPointsRepository'

export async function POST(req: NextRequest) {
    const repo = new PrPaymentRepository()
    const couponRepo = new PrCouponRepository()
    const pointsRepo = new PrUserPointsRepository()

    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        const userId = session.user.id

        const {
            tossPaymentKey, orderId, amount, addressId, orderIds,
            selectedCouponId,            // ← 추가
            pointsToUse                  // ← 추가 (number)
        } = await req.json()

        const data = await tossPOST('/payments/confirm', { paymentKey: tossPaymentKey, orderId, amount }, 'toss')
        const method = data.method as string
        const status = data.status as string
        const paymentNumberBig = BigInt(await repo.generateTodayPaymentNumber())

        const paymentDto: CreatePaymentDto = {
            tossPaymentKey: data.paymentKey,
            userId: session.user.id,
            addressId,
            paymentNumber: paymentNumberBig,
            price: amount,
            salePrice: data.amount,
            approvedAt: data.approvedAt ? new Date(data.approvedAt) : new Date(),
            createdAt: data.requestedAt ? new Date(data.requestedAt) : new Date(),
            method,
            status: status as 'DONE' | 'CANCELED',
            orderIds,
        }

        const paymentRepo = new PrPaymentRepository()
        await paymentRepo.save(paymentDto)

        // ✅ 방금 저장한 결제 다시 조회해서 sequence id 확보
        const createdPayment: GetPaymentDto | null = await paymentRepo.findByTossPaymentKey(data.paymentKey)
        if (!createdPayment?.id) {
            throw new Error('Payment 저장 후 ID를 찾을 수 없습니다.')
        }

        // ✅ 주문들에 paymentId(시퀀스) 연결
        await paymentRepo.updateOrderPaymentIds(orderIds, createdPayment.id)

        // ✅ 쿠폰 소모 (선택된 경우)
        if (selectedCouponId) {
            await couponRepo.consumeByDelete(userId, Number(selectedCouponId))
        }

        // ✅ 포인트 차감 (요청된 경우)
        if (pointsToUse && pointsToUse > 0) {
            await pointsRepo.debit({
                userId,
                amount: Number(pointsToUse),
            })
        }

        // ✅ 카드 저장 시에도 paymentId(시퀀스) 사용
        if (data.method === 'CARD' && data.card) {
            const cardRepo = new PrCardRepository()
            const cardDto: CreateCardDto = {
                paymentId: createdPayment.id, // <-- 기존 paymentNumber 사용하던 부분 교체
                issuerCode: data.card.issuerCode,
                acquirerCode: data.card.acquirerCode,
                number: data.card.number,
                installmentPlanMonths: data.card.installmentPlanMonths,
                approveNo: data.card.approveNo,
                useCardPoint: data.card.useCardPoint,
                isInterestFree: data.card.isInterestFree,
            }
            await cardRepo.save(cardDto)
        }

        // ✅ 응답에 paymentId 포함
        return NextResponse.json({
            id: createdPayment.id,                         // sequence id
            paymentNumber: paymentNumberBig.toString(),    // BigInt → string
            orderIds,
            status: 'DONE',
            approvedAt: paymentDto.approvedAt.toISOString(),
            method: paymentDto.method,
            amount,
        }, { status: 201 })

    } catch (error) {
        const errRes =
            (error as AxiosError)?.isAxiosError
                ? (error as AxiosError).response?.data
                : { message: (error as Error).message ?? '결제 승인 실패' }

        return NextResponse.json(errRes, { status: 400 })
    }
}

