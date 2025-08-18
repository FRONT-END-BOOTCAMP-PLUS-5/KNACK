import { IProduct } from '../entities/Product';
import { IProducts } from '../entities/Products';
import { IRecentProduct } from '../entities/RecentProduct';

export interface ProductRepository {
  find(id: number): Promise<IProduct | null>;
  findManyByIds(ids: number[]): Promise<IProducts[]>;
  findRecentProductIds(ids: number[]): Promise<IRecentProduct[]>;
}
