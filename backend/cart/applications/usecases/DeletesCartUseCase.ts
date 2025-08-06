import { CartRepository } from '../../domains/repositires/CartRepository';

export class DeletesCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async delete(ids: number[]): Promise<number> {
    const result = await this.repository.manyRemove(ids);

    return result;
  }
}
