import { CartRepository } from '../../domains/repositires/CartRepository';

export class CreateCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async create(): Promise<{ result: string }> {
    const result = await this.repository.insertCart();

    const message = result ? 'success' : 'fail';

    return {
      result: message,
    };
  }
}
