import { Payment } from '../entities/Payment'

export interface PaymentRepository {
    save(payment: Payment): Promise<void>
    updateOrderPaymentIds(orderIds: string[], paymentId: string): Promise<void>
    updateStatusByPaymentNumber(paymentNumber: string, status: string): Promise<void>
    findByPaymentNumber(paymentNumber: string): Promise<Payment | null>
}
