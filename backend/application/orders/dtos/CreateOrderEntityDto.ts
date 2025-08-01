// backend/application/dto/CreateOrderEntityDto.ts
export interface CreateOrderEntityDto {
    userId: string
    productId: string
    count: number
    price: number
    salePrice: number
    deliveryStatus: string
    createdAt: Date
}
