import prisma from '@/backend/utils/prisma';
import { ProductRepository } from '../domains/repositories/ProductRepository';
import { IProduct } from '../domains/entities/Product';
import { IProducts, IRecommendProducts, IRelationProducts } from '../domains/entities/Products';
import { IRecentProduct } from '../domains/entities/RecentProduct';
import { STORAGE_PATHS } from '@/constraint/auth';

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

  async findThumbnail(): Promise<{ thumbnailImage: string; id: number; korName: string }[]> {
    try {
      const data = await prisma.product.findMany({
        select: {
          thumbnailImage: true,
          id: true,
          korName: true,
        },
      });

      const result = data?.map((item) => {
        return {
          thumbnailImage: `${STORAGE_PATHS.PRODUCT?.THUMBNAIL}/${item.thumbnailImage}`,
          id: item.id,
          korName: item.korName,
        };
      });

      return result;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }

  async findRecommendProducts(): Promise<IRecommendProducts[]> {
    try {
      const data = await prisma.product.findMany({
        where: {
          isRecommended: true,
        },
        select: {
          id: true,
          korName: true,
          engName: true,
          price: true,
          thumbnailImage: true,
          brand: {
            select: {
              korName: true,
              engName: true,
              id: true,
              logoImage: true,
            },
          },
        },
      });

      const randomData = [0, 1, 2, 3, 4]?.map((_) => {
        const random = data.splice(Math.floor(Math.random() * data.length), 1)[0];

        return random;
      });

      return randomData;
    } catch (error) {
      throw error instanceof Error && error.message;
    }
  }

  async findRelationProducts(id: number): Promise<IRelationProducts[]> {
    try {
      const data = await prisma.relatedProduct.findMany({
        where: {
          productId: id,
        },
        select: {
          relatedProduct: {
            select: {
              id: true,
              korName: true,
              engName: true,
              thumbnailImage: true,
              price: true,
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
