// /backend/application/use-cases/CreateOrderUseCase.ts
import { OrderRepository } from '@/backend/domain/repositories/OrderRepository'
import { Order } from '@/backend/domain/entities/Order'

export class CreateOrderUseCase {
    constructor(private repo: OrderRepository) { }

    async execute(input: {
        userId: string
        items: { productId: string; count: number; price: number; salePrice?: number }[]
    }): Promise<string[]> {
        const now = new Date()

        const orders: Omit<Order, 'id'>[] = input.items.map((item) => ({
            userId: input.userId,
            productId: item.productId,
            count: item.count,
            price: item.price,
            salePrice: item.salePrice ?? item.price,
            deliveryStatus: 'READY',
            createdAt: now,
        }))

        return this.repo.saveMany(orders)
    }
}
