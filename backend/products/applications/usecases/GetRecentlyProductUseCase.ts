import { IRecentProduct } from '../../domains/entities/RecentProduct';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetRecentlyProductUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(ids: number[]): Promise<IRecentProduct[]> {
    try {
      const result = await this.repository.findRecentProductIds(ids);

      return result;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }
}
