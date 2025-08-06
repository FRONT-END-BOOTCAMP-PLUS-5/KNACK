import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository'
import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class KnackOrderRepository implements OrderRepository {

    async saveMany(orders: CreateOrderEntityDto[]): Promise<number[]> {
        const created = await prisma.$transaction(
            orders.map((o) =>
                prisma.order.create({
                    data: {
                        userId: o.userId,
                        productId: o.productId,
                        count: o.count,
                        price: o.price,
                        salePrice: o.salePrice,
                        deliveryStatus: o.deliveryStatus,
                        createdAt: o.createdAt,
                        paymentId: 0, // Temporary, will be updated later
                    },
                })
            )
        )
        return created.map((o) => o.id)
    }

    async updatePaymentId(orderIds: number[], paymentId: number): Promise<void> {
        await prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { paymentId },
        })
    }
}
