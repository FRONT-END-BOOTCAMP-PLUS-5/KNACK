import { BrandLikesRepository } from '../../domains/repositories/BrandLikesRepository';

export class DeleteBrandLikesUseCase {
  private repository: BrandLikesRepository;

  constructor(repository: BrandLikesRepository) {
    this.repository = repository;
  }

  async delete(brandId: number, userId: string): Promise<number> {
    try {
      const result = await this.repository.delete(brandId, userId);

      return result;
    } catch {
      throw new Error('===== DeleteBrandLikesUseCase Error =====');
    }
  }
}
