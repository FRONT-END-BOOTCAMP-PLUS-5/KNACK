import { LikesRepository } from '../../domains/repositories/LikesRepository';

export class DeleteLikesUseCase {
  private repository: LikesRepository;

  constructor(repository: LikesRepository) {
    this.repository = repository;
  }

  async delete(id: number, userId: string): Promise<number> {
    try {
      const result = await this.repository.delete(id, userId);

      return result;
    } catch {
      throw new Error('===== DeleteLikesUseCase Error =====');
    }
  }
}
