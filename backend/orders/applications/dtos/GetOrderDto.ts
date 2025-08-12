import { OrderItemDto } from './GetOrderItemDto'

export interface OrderDto {
    id: number
    userId: string
    paymentId: number | null
    addressId: number
    createdAt: string
    items: OrderItemDto[]
}
