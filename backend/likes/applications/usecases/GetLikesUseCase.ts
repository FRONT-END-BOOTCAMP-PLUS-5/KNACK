import { Like } from '../../domains/entities/Likes';
import { LikesRepository } from '../../domains/repositories/LikesRepository';

export class GetLikesUseCase {
  private repository: LikesRepository;

  constructor(repository: LikesRepository) {
    this.repository = repository;
  }

  async findById(ids: number[]): Promise<Like[]> {
    try {
      const result = await this.repository.findById(ids);

      return result;
    } catch {
      throw new Error('===== GetLikeUseCase Error =====');
    }
  }
}
