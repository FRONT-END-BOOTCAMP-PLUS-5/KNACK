import { Order } from "../entities/Order";

export interface OrderRepository {
    saveMany(orders: Omit<Order, 'id'>[]): string[] | PromiseLike<string[]>;
    updatePaymentId(orderIds: string[], paymentId: string): Promise<void>;
}
