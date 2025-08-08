import { NextRequest, NextResponse } from 'next/server'
import { serverPost as tossPOST } from '@/backend/utils/serverRequester'
import type { AxiosError } from 'axios'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { KnackPaymentRepository } from '@/backend/payments/repositories/KnackPaymentRepository'
import { KnackCardRepository } from '@/backend/payments/repositories/KnackCardRepository'
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto'
import { CreateCardDto } from '@/backend/payments/applications/dtos/CreateCardDto'

export async function POST(req: NextRequest) {
    const repo = new KnackPaymentRepository();
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
        }

        const { tossPaymentKey, orderId, amount, addressId, method, status, orderIds } = await req.json()

        const data = await tossPOST('/payments/confirm', { paymentKey: tossPaymentKey, orderId, amount }, 'toss')
        const paymentNumberBig = BigInt(await repo.generateTodayPaymentNumber())

        const paymentDto: CreatePaymentDto = {
            tossPaymentKey: data.paymentKey,
            userId: session.user.id, // ✅ 세션 기반 userId 사용
            addressId,
            paymentNumber: paymentNumberBig,
            price: amount,
            approvedAt: data.approvedAt ? new Date(data.approvedAt) : new Date(),
            createdAt: data.requestedAt ? new Date(data.requestedAt) : new Date(),
            method,
            status,
            orderIds, // 프론트에서 전달하거나 서버에서 조회할 수도 있음
        }

        const paymentRepo = new KnackPaymentRepository()
        const savedPayment = await paymentRepo.save(paymentDto)
        if (savedPayment) {
            await paymentRepo.updateOrderPaymentIds(orderIds, savedPayment)
        } else {
            throw new Error('Payment 저장 후 ID를 찾을 수 없습니다.')
        }

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

        return NextResponse.json({
            paymentNumber: paymentNumberBig.toString(), // BigInt 직렬화
            orderIds,
            status: 'DONE',
            approvedAt: paymentDto.approvedAt.toISOString(),
            method: paymentDto.method,
            amount,
        }, { status: 201 })

    } catch (error) {
        const errRes =
            error && typeof error === 'object' && 'isAxiosError' in error
                ? (error as AxiosError).response?.data
                : { message: (error as Error).message ?? '결제 승인 실패' }

        return NextResponse.json(errRes, { status: 400 })
    }
}
