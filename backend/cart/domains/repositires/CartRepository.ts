import { Cart } from '../entities/Cart';

export interface CartRepository {
  insertCart(): Promise<number>;
  getCart(): Promise<Cart[]>;
}
