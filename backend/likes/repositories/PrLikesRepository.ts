import prisma from '@/backend/utils/prisma';
import { LikesRepository } from '../domains/repositories/LikesRepository';

interface IProps {
  userId: string;
  productId: number;
  optionValueId: number;
}

export class PrLikesRepository implements LikesRepository {
  private likeData;

  constructor(likeData?: IProps) {
    this.likeData = likeData;
  }

  async insert(): Promise<number> {
    const { optionValueId, productId, userId } = this.likeData ?? {};

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
}
