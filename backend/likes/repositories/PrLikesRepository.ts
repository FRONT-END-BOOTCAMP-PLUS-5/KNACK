import prisma from '@/backend/utils/prisma';
import { LikesRepository } from '../domains/repositories/LikesRepository';
import { Like } from '../domains/entities/Likes';

export class PrLikesRepository implements LikesRepository {
  async insert(userId: string, productId: number): Promise<number> {
    try {
      const result = await prisma.productLike.create({
        data: {
          userId: userId ?? '',
          productId: productId ?? 0,
        },
      });

      return result.productId;
    } catch {
      throw new Error('=====LIKE_INSERT_ERROR=====');
    }
  }

  async delete(productId: number, userId: string): Promise<number> {
    try {
      const result = await prisma.productLike.delete({
        where: {
          userId_productId: { userId, productId },
        },
        select: {
          productId: true,
        },
      });

      return result.productId;
    } catch {
      throw new Error('=====LIKE_INSERT_ERROR=====');
    }
  }

  async findById(userId: string): Promise<Like[]> {
    try {
      const result = await prisma.productLike.findMany({
        where: {
          userId: userId,
        },
        select: {
          createdAt: true,
          product: {
            select: {
              thumbnailImage: true,
              korName: true,
              engName: true,
              id: true,
              price: true,
              productOptionMappings: {
                select: {
                  optionType: {
                    select: {
                      optionValue: {
                        select: {
                          id: true,
                          isPrivate: true,
                          name: true,
                          typeId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return result;
    } catch {
      throw new Error('=====LIKE_SELECT_ERROR=====');
    }
  }
}
