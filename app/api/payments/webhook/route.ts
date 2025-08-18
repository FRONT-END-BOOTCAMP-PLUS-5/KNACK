// 📁 app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { paymentKey, status, secret, orderId, cancelAmount, remainingAmount } = body

    // ✅ 보안 검증
    const validSecret = process.env.TOSS_WEBHOOK_SECRET
    if (secret !== validSecret) {
        return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 })
    }

    const repository = new PrPaymentRepository()

    // ✅ 상태 Enum 처리 분기
    switch (status) {
        case 'DONE': {
            // 결제 완료 처리 (필요 시 추가 작업)
            await repository.updateStatusByTossPaymentKey(paymentKey, 'DONE')
            // ex: await orderService.markAsPaid(orderId)
            break
        }

        case 'CANCELED': {
            // 전체 취소 처리
            await repository.updateStatusByTossPaymentKey(paymentKey, 'CANCELED')
            // ex: await orderService.cancelOrder(orderId)
            break
        }

        case 'PARTIAL_CANCELED': {
            // 부분 취소 처리
            await repository.updateStatusByTossPaymentKey(paymentKey, 'PARTIAL_CANCELED')
            // ex: await orderService.partialCancel(orderId, cancelAmount)
            break
        }

        default:
            return NextResponse.json({ error: `Unhandled status: ${status}` }, { status: 400 })
    }

    return NextResponse.json({ message: 'Webhook processed', status })
}
