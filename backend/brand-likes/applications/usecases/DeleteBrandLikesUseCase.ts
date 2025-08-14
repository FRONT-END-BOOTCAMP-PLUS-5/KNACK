import { BrandLikesRepository } from '../../domains/repositories/BrandLikesRepository';

export class DeleteBrandLikesUseCase {
  private repository: BrandLikesRepository;

  constructor(repository: BrandLikesRepository) {
    this.repository = repository;
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.repository.delete(id);

      return result;
    } catch {
      throw new Error('===== DeleteBrandLikesUseCase Error =====');
    }
  }
}
