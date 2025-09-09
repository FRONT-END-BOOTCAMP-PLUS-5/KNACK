import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto';
import { RepoIndependentOrder } from '@/types/order';

export interface OrderRepository {
  findByUserId(userId: string): Promise<RepoIndependentOrder[]>;
  saveMany(orders: CreateOrderEntityDto[]): Promise<number[]>;
  updatePaymentId(orderIds: number[], paymentId: number): Promise<void>;
  updateDeliveryStatus(orderId: number, deliveryStatus: number): Promise<void>;
  findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]>;
  findById(id: number, userId: string): Promise<RepoIndependentOrder | null>;
}
