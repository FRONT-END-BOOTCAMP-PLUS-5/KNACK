// backend/application/dto/CreateOrderItemDto.ts
export interface CreateOrderItemDto {
    productId: string
    count: number
    price: number
    salePrice?: number
}
