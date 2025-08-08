import { PrismaClient } from '@prisma/client';
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

export class PrProductsRepository implements ProductSearchRepository {
  constructor(private prisma: PrismaClient) {}

  async getProducts(params: {
    filters?: ProductFilters;
    sort?: SortOption;
    pagination?: PaginationParams;
  }): Promise<ProductListResponse> {
    const { filters, sort = 'latest', pagination } = params;
    const limit = pagination?.limit || 20;
    const offset = pagination?.offset || 0;

    const whereConditions: Record<string, unknown> = {
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

      if (filters.brandId) {
        whereConditions.brandId = filters.brandId;
      }
      if (filters.categoryId) {
        whereConditions.categoryId = filters.categoryId;
      }
      if (filters.subCategoryId) {
        whereConditions.subCategoryId = filters.subCategoryId;
      }
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        whereConditions.price = {};
        if (filters.priceMin !== undefined) {
          (whereConditions.price as Record<string, number>).gte = filters.priceMin;
        }
        if (filters.priceMax !== undefined) {
          (whereConditions.price as Record<string, number>).lte = filters.priceMax;
        }
      }
      if (filters.discountMin !== undefined || filters.discountMax !== undefined) {
        whereConditions.discountPercent = {};
        if (filters.discountMin !== undefined) {
          (whereConditions.discountPercent as Record<string, number>).gte = filters.discountMin;
        }
        if (filters.discountMax !== undefined) {
          (whereConditions.discountPercent as Record<string, number>).lte = filters.discountMax;
        }
      }
      if (filters.benefit === 'under_price') {
        whereConditions.discountPercent = { gt: 0 };
      }

      if (filters.keywordColorId) {
        whereConditions.keywordColorId = filters.keywordColorId;
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
    }

    // ORDER BY 조건 구성
    const orderBy: Record<string, unknown> = {};
    switch (sort) {
      case 'latest':
        orderBy.createdAt = 'desc';
        break;
      case 'popular':
        orderBy.likes = { _count: 'desc' };
        break;
      case 'price_high':
        orderBy.price = 'desc';
        break;
      case 'price_low':
        orderBy.price = 'asc';
        break;
      case 'likes':
        orderBy.likes = { _count: 'desc' };
        break;
      case 'reviews':
        orderBy.reviews = { _count: 'desc' };
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // 커서 기반 페이지네이션
    let cursorCondition = {};
    if (pagination?.cursor) {
      cursorCondition = { id: { gt: parseInt(pagination.cursor) } };
    }

    // 상품 조회
    const products = await this.prisma.product.findMany({
      where: {
        ...whereConditions,
        ...cursorCondition,
      },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        _count: {
          select: {
            reviews: true,
            likes: true,
          },
        },
      },
      orderBy,
      take: limit + 1, // 다음 페이지 존재 여부 확인용
      skip: pagination?.cursor ? 1 : offset, // 커서 사용시 skip 1
    });

    // 다음 페이지 존재 여부 확인
    const hasNext = products.length > limit;
    const actualProducts = hasNext ? products.slice(0, limit) : products;

    // 응답 데이터 구성
    const mappedProducts: Product[] = actualProducts.map(
      (product) =>
        new Product(
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
          product._count.likes
        )
    );

    // 페이지네이션 정보 계산
    const totalCount = await this.prisma.product.count({ where: whereConditions });
    const page = Math.floor(offset / limit) + 1;

    const pageInfo: PageInfo = new PageInfo(
      hasNext,
      hasNext ? actualProducts[actualProducts.length - 1].id.toString() : undefined
    );

    const paginationInfo: PaginationInfo = new PaginationInfo(offset, limit, page, totalCount);

    return new ProductListResponse(mappedProducts, pageInfo, paginationInfo);
  }
}
