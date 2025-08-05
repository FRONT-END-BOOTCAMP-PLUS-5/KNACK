// backend/application/dto/CreateOrderEntityDto.ts
export interface CreateOrderEntityDto {
    userId: string
    productId: number
    count: number
    price: number
    salePrice: number
    deliveryStatus: number
    createdAt: Date
}
