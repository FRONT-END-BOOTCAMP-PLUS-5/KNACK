import { PaymentRepository } from '../../domains/repositories/PaymentRepository';
import { CreatePaymentDto } from '../dtos/CreatePaymentDto';

export class CreatePaymentUseCase {
  private repository: PaymentRepository;

  constructor(repository: PaymentRepository) {
    this.repository = repository;
  }

  async create(data: CreatePaymentDto): Promise<number> {
    const id = await this.repository.save(data);

    return id;
  }
}
