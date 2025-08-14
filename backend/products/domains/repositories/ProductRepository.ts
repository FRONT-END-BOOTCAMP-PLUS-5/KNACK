import { IProduct } from '../entities/Product';
import { IProducts } from '../entities/Products';

export interface ProductRepository {
  find(id: number): Promise<IProduct | null>;
  findManyByIds(ids: number[]): Promise<IProducts[]>;
}
