import { OrderRepository } from "../../domains/repositories/OrderRepository";

export class GetOrderAmountByIdUseCase {
    constructor(private readonly repo: OrderRepository) { }
    async execute(userId: string) {
        const orders = await this.repo.findByUserId(userId);

        // 전체 주문 수        
        const totalOrders = orders;
        // 배송중인 주문 수 (COMPLETED가 아닌 모든 주문)
        const inProgressOrders = orders.filter(order => order.deliveryStatus !== 4)
        // 배송완료된 주문 수
        const completedOrders = orders.filter(
            order => order.deliveryStatus === 4)
        return {
            total: totalOrders, inProgress: inProgressOrders,
            completed: completedOrders
        };
    }
}













