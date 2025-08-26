import prisma from '@/backend/utils/prisma';
import { Prisma } from '@prisma/client';
import { CartRepository } from '../domains/repositories/CartRepository';
import { Cart } from '../domains/entities/Cart';

interface IProps {
  userId: string;
  productId: number;
  optionValueId: number;
  count: number;
}

export class PrCartRepository implements CartRepository {
  private cartData;

  constructor(cartData?: IProps) {
    this.cartData = cartData;
  }

  async upsertCart(id: number, userId: string): Promise<number> {
    const { count, optionValueId, productId } = this.cartData ?? {};

    const result = await prisma.cart.upsert({
      where: {
        id: id,
      },
      update: {
        count: count,
        optionValueId: optionValueId,
      },
      create: {
        productId: productId ?? 0,
        count: count ?? 0,
        optionValueId: optionValueId ?? 0,
        userId: userId,
      },
    });

    return result.id;
  }

  async getCart(userId: string): Promise<Cart[]> {
    const result = await prisma.cart.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            productOptionMappings: {
              include: {
                optionType: {
                  include: {
                    optionValue: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  }

  async remove(id: number): Promise<number> {
    const result = await prisma.cart.delete({
      where: { id: id },
    });

    return result.id;
  }

  async manyRemove(ids: number[]): Promise<number> {
    const result = await prisma.cart.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result.count;
  }

  async deleteManyByIdsForUser(tx: Prisma.TransactionClient, userId: string, cartIds: number[]): Promise<void> {
    await tx.cart.deleteMany({
      where: {
        userId,
        id: {
          in: cartIds,
        },
      },
    });
  }
}
