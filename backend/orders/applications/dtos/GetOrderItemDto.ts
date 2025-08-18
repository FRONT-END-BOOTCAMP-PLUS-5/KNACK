export interface OrderItemDto {
    id: number
    productId: number
    name: string
    thumbnailUrl: string | null
    unitPrice: number
    count: number
}