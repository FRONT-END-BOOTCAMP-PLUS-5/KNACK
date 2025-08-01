// 📁 backend/infrastructure/db/PrismaPaymentRepository.ts
import { PrismaClient } from '@prisma/client'
import { PaymentRepository } from '@/backend/domain/repositories/PaymentRepository'
import { CreatePaymentDto } from '@/backend/application/payments/dtos/CreatePaymentDto'

const prisma = new PrismaClient()

export class KnackPaymentRepository implements PaymentRepository {
    async save(payment: CreatePaymentDto): Promise<void> {
        await prisma.payment.create({
            data: {
                userId: payment.userId,
                addressId: payment.addressId,
                price: payment.price,
                createdAt: payment.createdAt ?? new Date(),
                paymentNumber: payment.paymentNumber,
            },
        })
    }

    async updateOrderPaymentIds(orderIds: string[], paymentId: string): Promise<void> {
        await prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { paymentId },
        })
    }

    async updateStatusByPaymentNumber(paymentNumber: string, status: string): Promise<void> {
        await prisma.payment.update({
            where: { paymentNumber },
            data: { status },
        })
    }

    async findByPaymentNumber(paymentNumber: string): Promise<CreatePaymentDto | null> {
        const data = await prisma.payment.findUnique({ where: { paymentNumber: parseInt(paymentNumber) } })
        if (!data) return null

        return {
            userId: data.userId,
            addressId: data.addressId,
            price: data.price ?? 0,
            createdAt: data.createdAt ?? new Date(),
            paymentNumber: data.paymentNumber,
            approvedAt: new Date(),
            method: data.method,
            status: 'DONE' as const, // Default status
        }
    }
}
