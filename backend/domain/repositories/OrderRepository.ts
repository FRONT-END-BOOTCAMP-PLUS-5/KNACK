import { Order } from "../entities/Order";

export interface OrderRepository {
    saveMany(orders: Omit<Order, 'id'>[]): string[] | PromiseLike<string[]>;
    save(order: Order): Promise<Order>;
    findByPaymentId(paymentId: string): Promise<Order>;
}
