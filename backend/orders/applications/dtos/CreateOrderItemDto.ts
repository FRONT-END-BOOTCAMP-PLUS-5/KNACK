// backend/application/dto/CreateOrderItemDto.ts
export interface CreateOrderItemDto {
  productId: number;
  count: number;
  price: number;
  salePrice?: number;
  optionValueId: number;
  couponPrice?: number;
  point?: number;
}
