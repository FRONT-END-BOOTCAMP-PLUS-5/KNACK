import { IProduct } from '../../domains/entities/Product';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetProductUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<IProduct | null> {
    const result = await this.repository.find(id);

    return result;
  }
}
