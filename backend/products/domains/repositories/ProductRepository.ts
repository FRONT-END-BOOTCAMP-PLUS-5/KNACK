import { IProduct } from '../entities/Product';

export interface ProductRepository {
  find(id: number): Promise<IProduct | null>;
}
