import { IProduct } from '../entities/Product';
import { IProducts, IRecommendProducts, IRelationProducts } from '../entities/Products';
import { IRecentProduct } from '../entities/RecentProduct';

export interface ProductRepository {
  find(id: number): Promise<IProduct | null>;
  findManyByIds(ids: number[]): Promise<IProducts[]>;
  findRecentProductIds(ids: number[]): Promise<IRecentProduct[]>;
  findThumbnail(): Promise<{ thumbnailImage: string; id: number; korName: string }[]>;
  findRecommendProducts(): Promise<IRecommendProducts[]>;
  findRelationProducts(id: number): Promise<IRelationProducts[]>;
}
