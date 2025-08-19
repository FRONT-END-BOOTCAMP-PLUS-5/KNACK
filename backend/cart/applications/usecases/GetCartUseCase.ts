import { Cart } from '../../domains/entities/Cart';
import { CartRepository } from '../../domains/repositories/CartRepository';

export class GetCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async execute(userId: string): Promise<Cart[]> {
    const result = await this.repository.getCart(userId);

    return result;
  }
}
