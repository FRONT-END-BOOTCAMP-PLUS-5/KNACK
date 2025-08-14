import prisma from '@/backend/utils/prisma';

import { BrandLike } from '../domains/entities/BrandLikes';
import { BrandLikesRepository } from '../domains/repositories/BrandLikesRepository';

export class PrBrandLikesRepository implements BrandLikesRepository {
  async insert(userId: string, brandId: number): Promise<number> {
    try {
      const result = await prisma.brandLike.create({
        data: {
          userId: userId ?? '',
          brandId: brandId ?? 0,
        },
      });

      return result.id;
    } catch {
      throw new Error('=====BRANDS_INSERT_ERROR=====');
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await prisma.brandLike.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      });

      return result.id;
    } catch {
      throw new Error('=====BRAND_LIKE_INSERT_ERROR=====');
    }
  }

  async findById(userId: string): Promise<BrandLike[]> {
    try {
      const result = await prisma.brandLike.findMany({
        where: {
          userId: userId,
        },
      });

      return result;
    } catch {
      throw new Error('=====BRAND_LIKE_SELECT_ERROR=====');
    }
  }
}
