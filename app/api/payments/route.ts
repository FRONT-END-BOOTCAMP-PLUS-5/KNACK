// 📁 app/api/payments/route.ts (Next.js 13+ App Router 기준)
import { NextRequest, NextResponse } from 'next/server'
import { serverPost as tossPOST } from '@/backend/utils/serverRequester'
import { KnackPaymentRepository } from '@/backend/infrastructure/repositories/KnackPaymentRepository'
import { CreatePaymentDto } from '@/backend/application/payments/dtos/CreatePaymentDto'

export async function POST(req: NextRequest) {
    try {
        const { paymentKey, orderId, amount } = await req.json()
        const data = await tossPOST('/payments/confirm', { paymentKey, orderId, amount }, 'toss')

        // Toss 응답 기반 DTO 생성
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

        const repository = new KnackPaymentRepository()
        await repository.save(paymentDto)

        return NextResponse.json(data)
    } catch (error: any) {
        const errRes = error.response?.data ?? { message: '결제 승인 실패' }
        return NextResponse.json(errRes, { status: 400 })
    }
}
