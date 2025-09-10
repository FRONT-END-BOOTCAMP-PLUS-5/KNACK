import { PaymentRepository } from '../../domains/repositories/PaymentRepository';

export class GetOrderInPaymentsUseCase {
  private repository: PaymentRepository;

  constructor(repository: PaymentRepository) {
    this.repository = repository;
  }

  async execute(id: number, userId: string) {
    const payment = await this.repository.findWithOrdersById(id, userId);

    return { result: payment };
  }
}
