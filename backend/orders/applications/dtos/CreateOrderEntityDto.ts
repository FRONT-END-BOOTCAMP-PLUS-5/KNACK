// backend/application/dto/CreateOrderEntityDto.ts
export interface CreateOrderEntityDto {
  userId: string;
  productId: number;
  count: number;
  price: number;
  salePrice: number;
  deliveryStatus: DeliveryStatus;
  createdAt: Date;
  optionValueId: number;
  couponPrice: number;
  point: number;
}

export enum DeliveryStatus {
  PAID = 1,
  CONFIRMED = 2,
  DELIVERING = 3,
  COMPLETED = 4,
}