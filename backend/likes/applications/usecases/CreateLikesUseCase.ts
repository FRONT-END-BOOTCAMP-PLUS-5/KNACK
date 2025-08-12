import { LikesRepository } from '../../domains/repositories/LikesRepository';

export class CreateLikesUseCase {
  private repository: LikesRepository;

  constructor(repository: LikesRepository) {
    this.repository = repository;
  }

  async insert(): Promise<number> {
    const result = await this.repository.insert();

    return result;
  }
}
