import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'
import { OrderDto } from '../../applications/dtos/GetOrderDto'
import { RepoIndependentOrder } from '@/types/order'

export interface OrderRepository {
    linkOrdersToPayment(args: {
        orderIds: number[]
        paymentId: number
        userId: string
    }): Promise<number>
    saveMany(orders: CreateOrderEntityDto[]): Promise<number[]>
    updatePaymentId(orderIds: number[], paymentId: number): Promise<void>
    updateDeliveryStatus(orderId: number, deliveryStatus: number): Promise<void>
    findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]>
    findById(id: number, userId: string): Promise<OrderDto | null>
    findByIdWithAddress(id: number, userId: string): Promise<RepoIndependentOrder | null>
}