import { CreateOrderEntityDto } from '@/backend/application/orders/dtos/CreateOrderEntityDto'

export interface OrderRepository {
    saveMany(orders: CreateOrderEntityDto[]): Promise<string[]>
    updatePaymentId(orderIds: string[], paymentId: string): Promise<void>
}