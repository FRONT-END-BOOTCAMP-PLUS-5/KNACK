// server/usecases/getPaymentOrders.usecase.ts

import { PaymentRepository } from "../../domains/repositories/PaymentRepository"
import { GetPaymentDto } from "../dtos/GetPaymentDto"
import { normalizeStatus } from '@/utils/orders'

export class GetPaymentOrdersUseCase {
    constructor(private repo: PaymentRepository) { }

    async byId(paymentId: number, userId: string): Promise<GetPaymentDto> {
        const payment = await this.repo.findWithOrdersById(paymentId, userId)
        if (!payment) throw console.error('payment not found')

        return {
            id: payment.id,
            createdAt: payment.createdAt ?? new Date(),
            addressId: payment.address?.id ?? 0,
            paymentNumber: payment.paymentNumber,
            tossPaymentKey: payment.tossPaymentKey ?? null,
            price: typeof payment.price === 'bigint' ? Number(payment.price) : (payment.price ?? 0),
            approvedAt: payment.approvedAt ?? new Date(),
            method: payment.method ?? '',
            status: (['DONE', 'CANCELED'] as const).includes(normalizeStatus(payment.status) as 'DONE' | 'CANCELED')
                ? normalizeStatus(payment.status) as 'DONE' | 'CANCELED'
                : 'CANCELED',
            userId: userId,
            orderIds: payment.orders.map(order => order.id),
        }
    }

    async byNumber(paymentNumber: bigint, userId: string) {
        const payment = await this.repo.findWithOrdersByNumber(paymentNumber, userId)
        if (!payment) throw console.error('payment not found')
        return this.byId(payment.id, userId) // or map same as above; DRY하게 재사용
    }
}
