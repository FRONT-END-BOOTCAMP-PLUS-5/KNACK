import { LikesRepository } from '../../domains/repositories/LikesRepository';

export class DeleteLikesUseCase {
  private repository: LikesRepository;

  constructor(repository: LikesRepository) {
    this.repository = repository;
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.repository.delete(id);

      return result;
    } catch {
      throw new Error('===== DeleteLikesUseCase Error =====');
    }
  }
}
