import { CartRepository } from '../../domains/repositories/CartRepository';

export class CreateCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async create(id: number, userId: string): Promise<{ result: string }> {
    const result = await this.repository.upsertCart(id, userId);

    const message = result ? 'success' : 'fail';

    return {
      result: message,
    };
  }
}
