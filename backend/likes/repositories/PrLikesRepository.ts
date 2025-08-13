import prisma from '@/backend/utils/prisma';
import { LikesRepository } from '../domains/repositories/LikesRepository';
import { Like } from '../domains/entities/Likes';

interface IProps {
  productId: number;
  optionValueId: number;
}

export class PrLikesRepository implements LikesRepository {
  private likeData;

  constructor(likeData?: IProps) {
    this.likeData = likeData;
  }

  async insert(userId: string): Promise<number> {
    const { optionValueId, productId } = this.likeData ?? {};

    try {
      const result = await prisma.like.create({
        data: {
          userId: userId ?? '',
          optionValueId: optionValueId ?? 0,
          productId: productId ?? 0,
        },
      });

      return result.id;
    } catch {
      throw new Error('=====LIKE_INSERT_ERROR=====');
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await prisma.like.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      });

      return result.id;
    } catch {
      throw new Error('=====LIKE_INSERT_ERROR=====');
    }
  }

  async findById(ids: number[]): Promise<Like[]> {
    try {
      const result = await prisma.like.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return result;
    } catch {
      throw new Error('=====LIKE_SELECT_ERROR=====');
    }
  }
}
