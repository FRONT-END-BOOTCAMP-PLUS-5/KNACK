import { SortOption } from '@/backend/search/domains/entities/ProductFilters';

export interface GetProductsRequestDto {
  keyword?: string;

  color?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  priceMin?: number;
  priceMax?: number;
  discountMin?: number;
  discountMax?: number;
  size?: string;
  benefit?: 'under_price';

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
  descriptionText?: string | null;
  thumbnailImage?: string;
  subImages?: string[];
  price: number;
  discountPercent?: number;
  detailContents?: string | null;
  brandId?: number;
  categoryId?: number;
  isRecommended: boolean;
  isPrivate: boolean;
  createdAt: Date;
  gender?: string | null;
  hit: number;
  engName: string;
  korName: string;

  color?: string | null;
  size?: string | null;

  brand?: {
    id: number;
    korName: string;
    engName?: string;
  };
  categories: {
    id: number;
    korName: string;
    engName: string;
  }[];
  subCategories: {
    id: number;
    korName: string;
    engName: string;
    categoryId: number;
  }[];
  reviewsCount: number;
  likesCount: number;
}
