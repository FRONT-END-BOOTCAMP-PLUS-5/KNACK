// backend/application/use-cases/CreateOrderUseCase.ts

import { OrderRepository } from '../../domains/repositories/OrderRepository';
import { CreateOrderItemDto } from '../dtos/CreateOrderItemDto';

export class CreateOrderUseCase {
  constructor(private repo: OrderRepository) { }

  async execute(input: { userId: string; items: CreateOrderItemDto[] }): Promise<number[]> {
    const now = new Date();

    const orders = input.items.map((item) => ({
      userId: input.userId,
      productId: item.productId,
      count: item.count,
      price: item.price,
      salePrice: item.salePrice ?? item.price,
      deliveryStatus: 1, // Convert string to number based on schema
      createdAt: now,
      optionValueId: item.optionValueId,
      couponPrice: item.couponPrice ?? 0,
      point: item.point ?? 0,
    }));

    return this.repo.saveMany(orders);
  }
}
