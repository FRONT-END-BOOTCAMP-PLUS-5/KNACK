// backend/application/use-cases/CreateOrderUseCase.ts

import { OrderRepository } from '../../domains/repositories/OrderRepository';
import { CreateOrderItemDto } from '../dtos/CreateOrderItemDto';

export class CreateOrderUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(input: { userId: string; items: CreateOrderItemDto[] }): Promise<number[]> {
    const orders = input.items.map((item) => ({
      userId: input.userId,
      count: item.count,
      price: item.price,
      salePrice: item.salePrice ?? item.price,
      deliveryStatus: 1,
      couponPrice: item.couponPrice ?? 0,
      point: item.point ?? 0,
      brandName: item.brandName,
      categoryName: item.categoryName,
      colorEngName: item.colorEngName,
      colorKorName: item.colorKorName,
      engName: item.engName,
      korName: item.korName,
      gender: item.gender,
      optionName: item.optionName,
      optionValue: item.optionValue,
      releaseDate: item.releaseDate,
      subCategoryName: item.subCategoryName,
      thumbnailImage: item.thumbnailImage,
    }));

    return this.repo.saveMany(orders);
  }
}
