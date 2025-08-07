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
        console.log(session);
        if (!session?.user) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
        }

        console.log('🔐 유저 세션 정보:', session.user)

        const { paymentKey, orderId, amount, addressId, orderIds } = await req.json()

        console.log({
            paymentKey,
            orderId,
            amount,
        })

        const data = await tossPOST('/payments/confirm', { paymentKey, orderId, amount }, 'toss')

        const paymentDto: CreatePaymentDto = {
            tossPaymentKey: data.paymentKey,
            userId: session.user.id, // ✅ 세션 기반 userId 사용
            addressId,
            paymentNumber: BigInt(await repo.generateTodayPaymentNumber()),
            price: data.price,
            approvedAt: new Date(data.approvedAt),
            createdAt: new Date(data.requestedAt),
            method: data.method,
            status: data.status,
            orderIds, // 프론트에서 전달하거나 서버에서 조회할 수도 있음
        }

        const paymentRepo = new KnackPaymentRepository()
        await paymentRepo.save(paymentDto)

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
    } catch (error) {
        const errRes =
            error && typeof error === 'object' && 'isAxiosError' in error
                ? (error as AxiosError).response?.data
                : { message: (error as Error).message ?? '결제 승인 실패' }

        return NextResponse.json(errRes, { status: 400 })
    }
}
