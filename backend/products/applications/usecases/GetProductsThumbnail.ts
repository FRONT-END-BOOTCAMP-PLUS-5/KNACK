import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetProductsThumbnailUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(): Promise<{ thumbnailImage: string; id: number; korName: string }[]> {
    try {
      const result = await this.repository.findThumbnail();

      return result;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }
}
