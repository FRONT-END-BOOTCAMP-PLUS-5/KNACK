import { CartRepository } from '../../domains/repositories/CartRepository';

export class DeleteCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async delete(id: number): Promise<number> {
    const result = await this.repository.remove(id);

    return result;
  }
}
