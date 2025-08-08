import { SortOption } from '@/backend/search/domains/entities/ProductFilters';

export interface GetProductsRequestDto {
  keyword?: string;

  color?: string;
  brandId?: number;
  categoryId?: number;
  subCategoryId?: number;
  priceMin?: number;
  priceMax?: number;
  discountMin?: number;
  discountMax?: number;
  // size?: string;
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
  // detailContents?: string | null;
  brandId?: number;
  categoryId?: number;
  isRecommended: boolean;
  isPrivate: boolean;
  createdAt: Date;
  gender?: string | null;
  hit: number;
  engName: string;
  korName: string;

  colorKorName: string;
  colorEngName: string;
  modelNumber: string | null;
  releaseDate: string | null;

  brand: Brand;
  categories: Category[];
  subCategories: SubCategory[];
  reviewsCount: number;
  likesCount: number;
}

interface Brand {
  id: number;
  korName: string;
  engName?: string;
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
