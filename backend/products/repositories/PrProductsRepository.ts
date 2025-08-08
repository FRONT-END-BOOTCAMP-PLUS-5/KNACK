import prisma from '@/backend/utils/prisma';
import { ProductRepository } from '../domains/repositories/ProductRepository';
import { IProduct } from '../domains/entities/Product';

export class PrProductRepository implements ProductRepository {
  async find(id: number): Promise<IProduct | null> {
    try {
      const result = await prisma.product.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          descriptionText: true,
          thumbnailImage: true,
          subImages: true,
          price: true,
          discountPercent: true,
          detailImages: true,
          isRecommended: true,
          createdAt: true,
          gender: true,
          hit: true,
          engName: true,
          korName: true,
          colorEngName: true,
          colorKorName: true,
          modelNumber: true,
          releaseDate: true,
          topImages: true,
          brand: {
            select: {
              id: true,
              korName: true,
              engName: true,
              logoImage: true,
            },
          },
          category: {
            select: {
              id: true,
              engName: true,
              korName: true,
              subCategories: {
                select: {
                  id: true,
                  engName: true,
                  korName: true,
                  categoryId: true,
                },
              },
            },
          },
          reviews: {
            select: {
              contents: true,
              rating: true,
              reviewImages: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.error('Error in PrProductRepository.find:', error);
      throw new Error('Failed to find product from database.');
    }
  }
}
