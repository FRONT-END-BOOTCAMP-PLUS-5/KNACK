import { CreateOrderEntityDto } from '@/backend/application/orders/dtos/CreateOrderEntityDto'

export interface OrderRepository {
    saveMany(orders: CreateOrderEntityDto[]): Promise<number[]>
    updatePaymentId(orderIds: number[], paymentId: number): Promise<void>
}