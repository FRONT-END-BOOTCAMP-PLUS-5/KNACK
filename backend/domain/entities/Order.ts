export interface Order {
    id: string
    userId: string
    productId: string
    count: number
    price: number
    salePrice: number
    tracking?: string
    deliveryStatus: string
    createdAt: Date
    paymentId?: string
}