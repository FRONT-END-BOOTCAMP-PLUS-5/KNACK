import { Cart } from '../entities/Cart';

export interface CartRepository {
  upsertCart(id: number, userId: string): Promise<number>;
  getCart(userId: string): Promise<Cart[]>;
  remove(id: number): Promise<number>;
  manyRemove(ids: number[]): Promise<number>;
}
