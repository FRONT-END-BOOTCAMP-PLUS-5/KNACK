import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Cart } from '../entities/Cart';

export interface CartRepository {
  deleteManyByIdsForUser(userId: string, cartIds: number[]): Promise<void>;
  upsertCart(id: number, userId: string): Promise<number>;
  getCart(userId: string): Promise<Cart[]>;
  remove(id: number): Promise<number>;
  manyRemove(ids: number[]): Promise<number>;
}
