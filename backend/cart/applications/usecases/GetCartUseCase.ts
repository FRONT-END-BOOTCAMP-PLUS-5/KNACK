import { Cart } from '../../domains/entities/Cart';
import { CartRepository } from '../../domains/repositires/CartRepository';

export class GetCartUseCase {
  private repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Cart[]> {
    const result = await this.repository.getCart();

    return result;
  }
}
