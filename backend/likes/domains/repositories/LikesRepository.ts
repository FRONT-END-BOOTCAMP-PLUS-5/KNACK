import { Like } from '../entities/Likes';

export interface LikesRepository {
  insert(userId: string): Promise<number>;
  delete(id: number): Promise<number>;
  findById(ids: number[]): Promise<Like[]>;
}
