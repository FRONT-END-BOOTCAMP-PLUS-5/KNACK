import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Cart } from '../entities/Cart';

export interface CartRepository {
  deleteManyByIdsForUser(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, cartIds: number[]): unknown;
  upsertCart(id: number, userId: string): Promise<number>;
  getCart(userId: string): Promise<Cart[]>;
  remove(id: number): Promise<number>;
  manyRemove(ids: number[]): Promise<number>;
}
