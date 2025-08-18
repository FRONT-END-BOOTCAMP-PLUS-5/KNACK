import { CategoryRepository } from '../../domains/repositories/CategoryRepository';
import { CategoryResponseDto } from '../dtos/CategoryDto';

export class GetCategoryUseCase {
  private repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  async execute(): Promise<CategoryResponseDto[]> {
    try {
      const result = await this.repository.getCategories();

      return result;
    } catch {
      throw new Error('error');
    }
  }
}
