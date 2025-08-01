import { OrderRepository } from '@/backend/domain/repositories/OrderRepository';
import { Order } from '@/backend/domain/entities/Order';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class KnackOrderRepository implements OrderRepository {

    async saveMany(orders: Order[]): Promise<string[]> {
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
                    },
                })
            )
        )
        return created.map((o: { id: string }) => o.id)
    }

    async updatePaymentId(orderIds: string[], paymentId: string): Promise<void> {
        await prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { paymentId },
        })
    }
}   
