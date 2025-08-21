export interface OrderItemDto {
    id: number
    productId: number
    name: string
    thumbnailImage: string | null
    unitPrice: number
    count: number
}