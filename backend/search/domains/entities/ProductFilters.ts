import { Product } from './Product';

export class ProductFilters {
  constructor(
    public readonly keyword?: string,
    public readonly keywordColorId?: number,
    public readonly brandId?: number,
    public readonly categoryId?: number,
    public readonly subCategoryId?: number,
    public readonly priceMin?: number,
    public readonly priceMax?: number,
    public readonly discountMin?: number,
    public readonly discountMax?: number,
    public readonly size?: string,
    public readonly benefit?: 'under_price',
    public readonly gender?: string,
    public readonly soldOutInvisible?: boolean
  ) {}
}

export type SortOption =
  | 'latest' // 최신순 (기본값)
  | 'popular' // 인기순
  | 'price_high' // 가격 높은순
  | 'price_low' // 가격 낮은순
  | 'likes' // 관심 많은순
  | 'reviews'; // 리뷰 많은순

export class PaginationParams {
  constructor(
    public readonly cursor?: string,
    public readonly offset?: number,
    public readonly limit?: number,
    public readonly page?: number
  ) {}
}

export class PageInfo {
  constructor(public readonly hasNext: boolean, public readonly nextCursor?: string) {}
}

export class PaginationInfo {
  constructor(
    public readonly offset: number,
    public readonly limit: number,
    public readonly page: number,
    public readonly totalCount: number
  ) {}
}

export class ProductListResponse {
  constructor(
    public readonly products: Product[],
    public readonly pageInfo: PageInfo,
    public readonly pagination: PaginationInfo
  ) {}
}
