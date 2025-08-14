// server/usecases/getPaymentOrders.usecase.ts

import { PaymentRepository } from "../../domains/repositories/PaymentRepository"
import { GetPaymentDto } from "../dtos/GetPaymentDto"

export class GetPaymentOrdersUseCase {
    constructor(private repo: PaymentRepository) { }

    async byId(paymentId: number, userId: string): Promise<GetPaymentDto> {
        const payment = await this.repo.findWithOrdersById(paymentId, userId)
        if (!payment) throw console.error('payment not found')

        return {
            id: payment.id,
            createdAt: payment.createdAt ?? new Date(),
            addressId: payment.addressId,
            paymentNumber: payment.paymentNumber,
            tossPaymentKey: payment.tossPaymentKey,
            price: payment.price ?? 0,
            approvedAt: payment.approvedAt ?? new Date(),
            method: payment.method,
            status: payment.status,
            userId: userId,
            orderIds: payment.orderIds,
        }
    }

    async byNumber(paymentNumber: bigint, userId: string) {
        const payment = await this.repo.findWithOrdersByNumber(paymentNumber, userId)
        if (!payment) throw console.error('payment not found')
        return this.byId(payment.id, userId) // or map same as above; DRY하게 재사용
    }
}
