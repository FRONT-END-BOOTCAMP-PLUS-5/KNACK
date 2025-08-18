import prisma from '@/backend/utils/prisma';
import { FilterCountsRepository } from '@/backend/filter-counts/domains/repositories/FilterCountsRepository';
import { ProductFilters } from '@/backend/search/domains/entities/ProductFilters';
import { Prisma } from '@prisma/client';

export class PrFilterCountsRepository implements FilterCountsRepository {
  async getPrivateProductCount(filters?: ProductFilters): Promise<number> {
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

      if (filters.discountMin !== undefined || filters.discountMax !== undefined) {
        const discountFilter: Prisma.IntFilter = {};
        if (filters.discountMin !== undefined) {
          discountFilter.gte = filters.discountMin;
        }
        if (filters.discountMax !== undefined) {
          discountFilter.lte = filters.discountMax;
        }
        whereConditions.discountPercent = discountFilter;
      }

      if (filters.benefit) {
        whereConditions.discountPercent = { gt: 0 };
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

    const count = await prisma.product.count({
      where: whereConditions,
    });

    return count;
  }
}
