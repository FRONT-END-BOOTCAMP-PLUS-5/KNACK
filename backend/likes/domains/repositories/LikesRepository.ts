import { Like } from '../entities/Likes';

export interface LikesRepository {
  insert(userId: string, productId: number): Promise<number>;
  delete(productId: number, userId: string): Promise<number>;
  findById(userId: string): Promise<Like[]>;
}
