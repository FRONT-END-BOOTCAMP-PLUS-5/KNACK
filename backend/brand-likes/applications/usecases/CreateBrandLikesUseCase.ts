import { BrandLikesRepository } from '../../domains/repositories/BrandLikesRepository';

export class CreateBrandLikesUseCase {
  private repository: BrandLikesRepository;

  constructor(repository: BrandLikesRepository) {
    this.repository = repository;
  }

  async insert(userId: string, brandId: number): Promise<number> {
    const result = await this.repository.insert(userId, brandId);

    return result;
  }
}
