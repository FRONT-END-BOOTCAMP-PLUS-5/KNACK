import { OrderRepository } from "../../domains/repositories/OrderRepository";
import { DeliveryStatus } from "../dtos/CreateOrderEntityDto";

export class UpdateOrderStatusUseCase {
    constructor(private readonly repo: OrderRepository) { }
    async execute(orderId: number, status: DeliveryStatus): Promise<void> {        // Validate status
        const validStatuses = [
            DeliveryStatus.PAID,
            DeliveryStatus.CONFIRMED,
            DeliveryStatus.DELIVERING,
            DeliveryStatus.COMPLETED
        ];
        if (!validStatuses.includes(status)) {
            throw new Error('invalid_delivery_status');
        }
        // Update order delivery status        
        await this.repo.updateDeliveryStatus(orderId, status);
    }
}





