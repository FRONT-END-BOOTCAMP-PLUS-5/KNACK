import { IProducts } from '../../domains/entities/Products';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetIdsProductUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async findManyByIds(ids: number[]): Promise<IProducts[]> {
    try {
      const result = await this.repository.findManyByIds(ids);

      return result;
    } catch {
      throw new Error('===== GetLikeUseCase Error =====');
    }
  }
}
