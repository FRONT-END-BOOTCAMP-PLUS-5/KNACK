import { IBrand } from './brand';
import { ICategory, ISubCategory } from './category';

export interface ISearchProductList {
  id: number;
  thumbnailImage?: string;
  price: number;
  discountPercent?: number;
  isRecommended: boolean;
  hit: number;
  engName: string;
  korName: string;
  brand: Pick<IBrand, 'id' | 'korName' | 'engName'>;
  categories: Pick<ICategory, 'id' | 'korName' | 'engName'>[];
  subCategories: Pick<ISubCategory, 'id' | 'korName' | 'engName' | 'categoryId'>[];
  reviewsCount: number;
  likesCount: number;
  isSoldOut: boolean;
}

export type SortOption =
  | 'latest' // 최신순 (기본값)
  | 'popular' // 인기순
  | 'price_high' // 가격 높은순
  | 'price_low' // 가격 낮은순
  | 'likes' // 관심 많은순
  | 'reviews'; // 리뷰 많은순

export interface ISearchProductListRequest {
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
