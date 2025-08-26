import { IRelationProducts } from '../../domains/entities/Products';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetRelationProductsUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<IRelationProducts[]> {
    try {
      const result = await this.repository.findRelationProducts(id);

      return result;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }
}
