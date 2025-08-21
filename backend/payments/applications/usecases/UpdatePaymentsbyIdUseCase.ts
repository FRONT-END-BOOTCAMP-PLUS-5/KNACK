import { PaymentRepository } from '../../domains/repositories/PaymentRepository';
export class UpdatePaymentStatusUseCase {
    constructor(private readonly repo: PaymentRepository) { }
    async execute(orderId: number, status: string): Promise<void> {
        // Validate status        
        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            throw new Error('invalid_status');
        }
        // Update order status        
        await this.repo.updateStatusById(orderId, status);
    }
}







