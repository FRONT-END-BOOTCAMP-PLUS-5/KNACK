export interface Payment {
    id: string
    userId: string
    addressId: string
    price: number
    createdAt: Date
    paymentNumber: string
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED' | 'CONFIRMED' | 'DELIVERING' | 'COMPLETED'
}