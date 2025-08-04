// 📁 app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { serverPost as tossPOST } from '@/backend/utils/serverRequester'
import { KnackPaymentRepository } from '@/backend/infrastructure/repositories/KnackPaymentRepository'
import { KnackCardRepository } from '@/backend/infrastructure/repositories/KnackCardRepository'
import { CreatePaymentDto } from '@/backend/application/payments/dtos/CreatePaymentDto'
import { CreateCardDto } from '@/backend/application/payments/dtos/CreateCardDto'

export async function POST(req: NextRequest) {
    try {
        const { paymentKey, orderId, amount } = await req.json()

        const data = await tossPOST('/payments/confirm', { paymentKey, orderId, amount }, 'toss')

        // ✅ Toss 응답 기반 결제 DTO 생성
        const paymentDto: CreatePaymentDto = {
            tossPaymentKey: data.paymentKey,
            userId: data.user?.id ?? 'unknown',
            addressId: data.addressId,
            paymentNumber: data.paymentNumber ?? 0,
            price: data.totalAmount,
            approvedAt: new Date(data.approvedAt),
            createdAt: new Date(data.requestedAt),
            method: data.method,
            status: data.status,
            orderIds: data.orderIds,
        }

        const paymentRepo = new KnackPaymentRepository()
        await paymentRepo.save(paymentDto)

        // ✅ 카드 결제일 경우 카드 정보 저장
        if (data.method === 'CARD' && data.card) {
            const cardRepo = new KnackCardRepository()
            const savedPayment = await paymentRepo.findByTossPaymentKey(data.paymentKey)

            if (savedPayment) {
                const cardDto: CreateCardDto = {
                    paymentId: savedPayment.paymentNumber,
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
        }

        return NextResponse.json(data)
    } catch (error: any) {
        const errRes = error.response?.data ?? { message: '결제 승인 실패' }
        return NextResponse.json(errRes, { status: 400 })
    }
}
