import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository'
import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'
import { PrismaClient } from '@prisma/client'
import { OrderItemDto } from '../applications/dtos/GetOrderItemDto'
import { OrderDto } from '../applications/dtos/GetOrderDto'

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
                        paymentId: null,
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

    async findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]> {
        const orders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
                userId,
            },
            select: {
                id: true,
            },
        })

        return orders.map(order => order.id)
    }

    async findById(id: number, userId: string): Promise<OrderDto | null> {
        const order = await prisma.order.findFirst({
            where: { id, userId },
            include: {
                product: true,
                payment: {
                    include: {
                        address: true
                    }
                }
            },
        })
        if (!order) return null

        const items: OrderItemDto[] = [{
            id: order.id,
            productId: order.productId,
            name: order.product?.korName ?? order.product?.engName ?? '',
            thumbnailUrl: order.product?.thumbnailImage ?? null,
            unitPrice: Number(order.salePrice ?? order.price ?? 0),
            count: order.count ?? 0,
        }]

        const dto: OrderDto = {
            id: order.id,
            userId: order.userId,
            paymentId: order.paymentId ?? null,
            addressId: order.payment?.addressId ?? 0,
            createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
            items,
        }
        return dto
    }
}
