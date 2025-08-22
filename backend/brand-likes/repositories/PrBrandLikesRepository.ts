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

      return result.brandId;
    } catch {
      throw new Error('=====BRANDS_INSERT_ERROR=====');
    }
  }

  async delete(brandId: number, userId: string): Promise<number> {
    console.log('========================================');
    console.log('PrBrandLikesRepository', brandId, '/', userId);
    console.log('========================================');
    try {
      const result = await prisma.brandLike.delete({
        where: {
          userId_brandId: { brandId, userId },
        },
        select: {
          brandId: true,
        },
      });

      return result.brandId;
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
        select: {
          brand: {
            select: {
              engName: true,
              korName: true,
              logoImage: true,
              id: true,
              products: {
                select: {
                  korName: true,
                  engName: true,
                  thumbnailImage: true,
                  id: true,
                  price: true,
                },
              },
              _count: {
                select: {
                  brandLike: true,
                },
              },
            },
          },
        },
      });

      return result;
    } catch {
      throw new Error('=====BRAND_LIKE_SELECT_ERROR=====');
    }
  }
}
