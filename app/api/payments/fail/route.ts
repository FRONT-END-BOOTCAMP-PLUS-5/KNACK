// 📁 app/api/payments/fail/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { KnackPaymentRepository } from '@/backend/payments/repositories/KnackPaymentRepository'

// 클라이언트 실패 리다이렉트에서 보낼 수 있는 최소 파라미터 기준
export async function POST(req: NextRequest) {
    try {
        const { userId, addressId, method = 'TOSS', price = 0, orderIds } = await req.json()

        if (!userId || !addressId) {
            return NextResponse.json({ ok: false, message: 'userId/addressId required' }, { status: 400 })
        }

        const repo = new KnackPaymentRepository()

        await repo.createFailedPayment({
            params: {
                userId,
                addressId: Number(addressId),
                method,
                price: Number(price),
                orderIds: Array.isArray(orderIds) ? orderIds.map(Number) : [],
                createdAt: new Date(),
                paymentNumber: BigInt(0), // Will be generated in repository
                tossPaymentKey: '',
                approvedAt: new Date(),
                status: 'FAILED' as 'DONE' | 'CANCELED',
                salePrice: 0
            }
        })

        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('fail log error', e)
        return NextResponse.json({ ok: false, message: 'fail log error' }, { status: 500 })
    }
}
