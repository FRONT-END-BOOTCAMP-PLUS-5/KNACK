import { SortValueType } from '@/constraint/product';
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

export interface ISearchProductListResponse {
  products: ISearchProductList[];
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

  sort?: SortValueType;

  cursor?: string;
  offset?: number;
  limit?: number;
  page?: number;
}
