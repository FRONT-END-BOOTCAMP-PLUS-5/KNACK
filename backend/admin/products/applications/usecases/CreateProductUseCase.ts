import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class CreateProductUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async create(): Promise<{ result: string }> {
    const result = await this.repository.insertProduct();

    const message = result ? 'success' : 'fail';

    return {
      result: message,
    };
  }
}
