import { BrandLike } from '../../domains/entities/BrandLikes';
import { BrandLikesRepository } from '../../domains/repositories/BrandLikesRepository';

export class GetBrandLikesUseCase {
  private repository: BrandLikesRepository;

  constructor(repository: BrandLikesRepository) {
    this.repository = repository;
  }

  async findById(userId: string): Promise<BrandLike[]> {
    try {
      const result = await this.repository.findById(userId);

      return result;
    } catch {
      throw new Error('===== GetBrandLikesUseCase Error =====');
    }
  }
}
