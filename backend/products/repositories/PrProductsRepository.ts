import prisma from '@/backend/utils/prisma';
import { ProductRepository } from '../domains/repositories/ProductRepository';
import { IProduct } from '../domains/entities/Product';
import { IProducts } from '../domains/entities/Products';
import { IRecentProduct } from '../domains/entities/RecentProduct';

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
          productOptionMappings: {
            select: {
              optionType: {
                select: {
                  id: true,
                  name: true,
                  isPrivate: true,
                  optionValue: true,
                },
              },
            },
          },
          brand: {
            select: {
              id: true,
              korName: true,
              engName: true,
              logoImage: true,
              _count: {
                select: {
                  brandLike: true,
                },
              },
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
              productLike: {
                where: {
                  productId: id,
                },
              },
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

  findManyByIds(ids: number[]): Promise<IProducts[]> {
    return prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        thumbnailImage: true,
        price: true,
        engName: true,
        korName: true,
        colorEngName: true,
        colorKorName: true,
        productOptionMappings: {
          select: {
            optionType: {
              select: {
                id: true,
                name: true,
                isPrivate: true,
                optionValue: true,
              },
            },
          },
        },
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
      },
    });
  }

  async findRecentProductIds(ids: number[]): Promise<IRecentProduct[]> {
    try {
      const data = await prisma.product.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          id: true,
          thumbnailImage: true,
          price: true,
          hit: true,
          engName: true,
          korName: true,
          brand: {
            select: {
              id: true,
              korName: true,
              engName: true,
            },
          },
          category: {
            select: {
              id: true,
              korName: true,
              engName: true,
            },
          },
          subCategory: {
            select: {
              id: true,
              korName: true,
              engName: true,
              categoryId: true,
            },
          },
          optionValue: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              productLike: true,
            },
          },
        },
      });

      return data;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }
}
