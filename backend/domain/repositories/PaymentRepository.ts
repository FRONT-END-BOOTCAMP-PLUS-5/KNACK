// ✅ domain/repositories/PaymentRepository.ts (Prisma 기반 수정)

import { CreatePaymentDto } from '@/backend/application/payments/dtos/CreatePaymentDto'

export interface PaymentRepository {
    save(payment: CreatePaymentDto): Promise<void>
    updateOrderPaymentIds(orderIds: string[], paymentId: string): Promise<void>
    updateStatusByPaymentNumber(paymentNumber: string, status: string): Promise<void>
    findByPaymentNumber(paymentNumber: string): Promise<CreatePaymentDto | null>
}
