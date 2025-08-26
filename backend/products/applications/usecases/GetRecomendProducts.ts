import { IRecommendProdcuts } from '../../domains/entities/Products';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetRecommendProdcutsUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(): Promise<IRecommendProdcuts[]> {
    try {
      const result = await this.repository.findRecommendProducts();

      return result;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }
}
