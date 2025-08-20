import prisma from '@/backend/utils/prisma';
import { ProductSearchRepository } from '@/backend/search/domains/repositories/ProductSearchRepository';
import { Product, Brand, Category, SubCategory } from '@/backend/search/domains/entities/Product';
import {
  ProductFilters,
  SortOption,
  PaginationParams,
  ProductListResponse,
  PageInfo,
  PaginationInfo,
} from '@/backend/search/domains/entities/ProductFilters';
import { Prisma } from '@prisma/client';

export class PrProductsRepository implements ProductSearchRepository {
  async getProducts(params: {
    filters?: ProductFilters;
    sort?: SortOption;
    pagination?: PaginationParams;
  }): Promise<ProductListResponse> {
    const { filters, sort = 'latest', pagination } = params;
    const limit = pagination?.limit || 20;
    const offset = pagination?.offset || 0;

    const whereConditions: Prisma.ProductWhereInput = {
      isPrivate: true,
    };

    if (filters) {
      if (filters.keyword) {
        whereConditions.OR = [
          { korName: { contains: filters.keyword, mode: 'insensitive' } },
          { engName: { contains: filters.keyword, mode: 'insensitive' } },
          { descriptionText: { contains: filters.keyword, mode: 'insensitive' } },
        ];
      }

      if (filters.brandId && filters.brandId.length > 0) {
        whereConditions.brandId = { in: filters.brandId };
      }
      if (filters.categoryId && filters.categoryId.length > 0) {
        whereConditions.categoryId = { in: filters.categoryId };
      }
      if (filters.subCategoryId && filters.subCategoryId.length > 0) {
        whereConditions.subCategoryId = { in: filters.subCategoryId };
      }
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        const priceFilter: Prisma.IntFilter = {};
        if (filters.priceMin !== undefined) {
          priceFilter.gte = filters.priceMin;
        }
        if (filters.priceMax !== undefined) {
          priceFilter.lte = filters.priceMax;
        }
        whereConditions.price = priceFilter;
      }

      const discountFilter: Prisma.IntFilter = {};
      let hasDiscountCondition = false;

      if (filters.discountMin !== undefined || filters.discountMax !== undefined) {
        if (filters.discountMin !== undefined) {
          discountFilter.gte = filters.discountMin;
        }
        if (filters.discountMax !== undefined) {
          discountFilter.lte = filters.discountMax;
        }
        hasDiscountCondition = true;
      }

      if (filters.benefit) {
        if (hasDiscountCondition) {
          discountFilter.gte = Math.max(discountFilter.gte || 0, 1);
        } else {
          discountFilter.gt = 0;
        }
        hasDiscountCondition = true;
      }

      if (hasDiscountCondition) {
        whereConditions.discountPercent = discountFilter;
      }

      if (filters.keywordColorId && filters.keywordColorId.length > 0) {
        whereConditions.keywordColorId = { in: filters.keywordColorId };
      }
      if (filters.gender) {
        whereConditions.gender = filters.gender;
      }
      if (filters.soldOutInvisible) {
        whereConditions.NOT = {
          productStockMapping: {
            every: {
              stock: 0,
            },
          },
        };
      }
      if (filters.size && filters.size.length > 0) {
        whereConditions.productStockMapping = {
          some: {
            optionValue: {
              name: { in: filters.size },
            },
          },
        };
      }
    }

    // ORDER BY 조건 구성
    const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = (() => {
      switch (sort) {
        case 'latest':
          return [{ createdAt: 'desc' }, { id: 'desc' }];
        //TODO: 인기순 기준 추후 수정 필요
        case 'popular':
          return [{ productLike: { _count: 'desc' } }, { createdAt: 'desc' }, { id: 'desc' }];
        case 'likes':
          return [{ productLike: { _count: 'desc' } }, { createdAt: 'desc' }, { id: 'desc' }];
        case 'price_high':
          return [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }];
        case 'price_low':
          return [{ price: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }];
        case 'reviews':
          return [{ reviews: { _count: 'desc' } }, { createdAt: 'desc' }, { id: 'desc' }];
        default:
          return [{ createdAt: 'desc' }, { id: 'desc' }];
      }
    })();

    const prismaCursor: Prisma.ProductWhereUniqueInput | undefined = pagination?.cursor
      ? { id: parseInt(pagination.cursor) }
      : undefined;

    // 상품 조회
    const products = await prisma.product.findMany({
      where: {
        ...whereConditions,
      },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        productStockMapping: {
          select: {
            stock: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            productLike: true,
          },
        },
      },
      orderBy,
      cursor: prismaCursor,
      take: limit + 1, // 다음 페이지 존재 여부 확인용
      skip: pagination?.cursor ? 1 : offset, // 커서 사용시 skip 1
    });

    // 다음 페이지 존재 여부 확인
    const hasNext = products.length > limit;
    const actualProducts = hasNext ? products.slice(0, limit) : products;

    // 응답 데이터 구성
    const mappedProducts: Product[] = actualProducts.map((product) => {
      // isSoldOut 계산: 모든 재고가 0이면 true
      const hasStockMappings = product.productStockMapping.length > 0;
      const isSoldOut = hasStockMappings ? product.productStockMapping.every((stock) => stock.stock === 0) : true;

      return new Product(
        product.id,
        product.thumbnailImage,
        product.price || 0,
        product.discountPercent || 0,
        product.isRecommended,
        product.hit || 0,
        product.engName,
        product.korName,
        new Brand(product.brand.id, product.brand.korName, product.brand.engName),
        [new Category(product.category.id, product.category.korName, product.category.engName)],
        product.subCategory
          ? [
              new SubCategory(
                product.subCategory.id,
                product.subCategory.korName,
                product.subCategory.engName,
                product.subCategory.categoryId
              ),
            ]
          : [],
        product._count.reviews,
        product._count.productLike,
        isSoldOut
      );
    });

    // 페이지네이션 정보 계산
    const totalCount = await prisma.product.count({ where: whereConditions });
    const page = Math.floor(offset / limit) + 1;

    const pageInfo: PageInfo = new PageInfo(
      hasNext,
      hasNext ? actualProducts[actualProducts.length - 1].id.toString() : undefined
    );

    const paginationInfo: PaginationInfo = new PaginationInfo(offset, limit, page, totalCount);

    return new ProductListResponse(mappedProducts, pageInfo, paginationInfo);
  }
}
