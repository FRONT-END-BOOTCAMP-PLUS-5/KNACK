import { Like } from '../entities/Likes';

export interface LikesRepository {
  insert(userId: string, productId: number): Promise<number>;
  delete(id: number): Promise<number>;
  findById(userId: string): Promise<Like[]>;
}
