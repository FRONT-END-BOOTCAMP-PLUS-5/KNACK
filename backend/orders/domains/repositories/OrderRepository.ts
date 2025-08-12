import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'
import { OrderDto } from '../../applications/dtos/GetOrderDto'

export interface OrderRepository {
    saveMany(orders: CreateOrderEntityDto[]): Promise<number[]>
    updatePaymentId(orderIds: number[], paymentId: number): Promise<void>
    findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]>
    findById(id: number, userId: string): Promise<OrderDto | null>
}