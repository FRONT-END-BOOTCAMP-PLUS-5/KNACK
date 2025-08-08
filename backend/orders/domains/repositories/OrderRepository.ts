import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'

export interface OrderRepository {
    saveMany(orders: CreateOrderEntityDto[]): Promise<number[]>
    updatePaymentId(orderIds: number[], paymentId: number): Promise<void>
    findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]>
}