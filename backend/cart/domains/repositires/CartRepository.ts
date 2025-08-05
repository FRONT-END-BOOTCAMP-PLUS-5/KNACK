import { Cart } from '../entities/Cart';

export interface CartRepository {
  insertCart(): Promise<number>;
  getCart(): Promise<Cart[]>;
  remove(id: number): Promise<number>;
  manyRemove(ids: number[]): Promise<number>;
}
