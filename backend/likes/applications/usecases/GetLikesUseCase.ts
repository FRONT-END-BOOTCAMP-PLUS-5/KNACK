import { Like } from '../../domains/entities/Likes';
import { LikesRepository } from '../../domains/repositories/LikesRepository';

export class GetLikesUseCase {
  private repository: LikesRepository;

  constructor(repository: LikesRepository) {
    this.repository = repository;
  }

  async findById(userId: string): Promise<Like[]> {
    try {
      const result = await this.repository.findById(userId);

      return result;
    } catch {
      throw new Error('===== GetLikeUseCase Error =====');
    }
  }
}
