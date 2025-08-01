// backend/application/use-cases/CreateOrderUseCase.ts
import { OrderRepository } from '@/backend/domain/repositories/OrderRepository'
import { CreateOrderItemDto } from '@/backend/application/orders/dtos/CreateOrderItemDto'

export class CreateOrderUseCase {
    constructor(private repo: OrderRepository) { }

    async execute(input: {
        userId: string
        items: CreateOrderItemDto[]
    }): Promise<string[]> {
        const now = new Date()

        const orders = input.items.map((item) => ({
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
