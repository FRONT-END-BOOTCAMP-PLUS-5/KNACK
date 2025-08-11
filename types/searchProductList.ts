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
