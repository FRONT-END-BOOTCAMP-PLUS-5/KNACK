import { PaymentRepository } from '../../domains/repositories/PaymentRepository';

export class GetPaymentsByUserIdUseCase {
  private repository: PaymentRepository;

  constructor(repository: PaymentRepository) {
    this.repository = repository;
  }

  async execute(userId: string) {
    const payments = await this.repository.findWithOrderItemsByUserId(userId);

    return { result: payments };
  }
}
