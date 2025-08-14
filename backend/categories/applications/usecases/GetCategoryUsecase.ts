import { Category } from '../../domains/entities/Category';
import { CategoryRepository } from '../../domains/repositories/CategoryRepository';

export class GetCategoryUseCase {
  private repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Category[]> {
    const result = await this.repository.getCategories();

    return result;
  }
}
