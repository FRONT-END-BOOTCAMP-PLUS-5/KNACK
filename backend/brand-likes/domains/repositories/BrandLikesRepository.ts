import { BrandLike } from '../entities/BrandLikes';

export interface BrandLikesRepository {
  insert(userId: string, brandId: number): Promise<number>;
  delete(id: number): Promise<number>;
  findById(userId: string): Promise<BrandLike[]>;
}
