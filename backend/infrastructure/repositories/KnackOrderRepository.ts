import { OrderRepository } from '@/backend/domain/repositories/OrderRepository';
import { Order } from '@/backend/domain/entities/Order';
import { serverRequester } from '@/backend/utils/serverRequester';

export class KnackOrderRepository implements OrderRepository {
    ; async save(order: Order) {
        const res = await serverRequester.post('/orders', order);
        return res.data;
    }

    async saveMany(orders: Omit<Order, 'id'>[]): Promise<string[]> {
        const res = await serverRequester.post('/orders/batch', { orders });
        return res.data;
    }

    async findByPaymentId(paymentId: string) {
        const res = await serverRequester.get(`/orders?paymentId=${paymentId}`);
        return res.data;
    }
}   
