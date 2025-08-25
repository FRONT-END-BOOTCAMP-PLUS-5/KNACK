import { SortOption } from '@/backend/search/domains/entities/ProductFilters';

export interface GetProductsRequestDto {
  userId?: string;
  keyword?: string;

  keywordColorId?: number[];
  brandId?: number[];
  categoryId?: number[];
  subCategoryId?: number[];
  price?: string;
  discount?: string;
  size?: string[];
  benefit?: boolean;
  gender?: string;
  soldOutInvisible?: boolean;

  sort?: SortOption;

  cursor?: string;
  offset?: number;
  limit?: number;
  page?: number;
}

export interface GetProductsResponseDto {
  products: ProductDto[];
  pageInfo: {
    nextCursor?: string;
    hasNext: boolean;
  };
  pagination: {
    offset: number;
    limit: number;
    page: number;
    totalCount: number;
  };
}

export interface ProductDto {
  id: number;
  thumbnailImage?: string;
  price: number;
  discountPercent?: number;
  isRecommended: boolean;
  hit: number;
  engName: string;
  korName: string;
  brand: Brand;
  categories: Category[];
  subCategories: SubCategory[];
  reviewsCount: number;
  likesCount: number;
  isSoldOut: boolean;
  isLiked: boolean;
}

interface Brand {
  id: number;
  korName: string;
  engName: string;
}

interface Category {
  id: number;
  korName: string;
  engName: string;
}

interface SubCategory {
  id: number;
  korName: string;
  engName: string;
  categoryId: number;
}
