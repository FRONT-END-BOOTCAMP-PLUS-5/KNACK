import { IBrand } from './brand';
import { ICategory, ISubCategory } from './category';

export interface IProduct {
  id: number;
  descriptionText?: string;
  detailContents?: string;
  discountPercent: number;
  engName: string;
  korName: string;
  gender: string;
  hit: number;
  isPrivate: boolean;
  isRecommended: boolean;
  price: number;
  subImages: string;
  thumbnailImage: string;
  brandId: number;
  categoryId: number;
  brand: IBrand;
  category: ICategory;
  productOptionMappings: IProductOptionMapping[];
  colorKorName: string;
  colorEngName: string;
  releaseDate?: string;
}

export interface IProductOptionMapping {
  id: number;
  optionType: IOptionType;
  optionTypeId: number;
  productId: number;
  stock: number;
}

export interface IOptionValue {
  id: number;
  isPrivate: boolean;
  name: string;
  typeId: number;
}

export interface IOptionType {
  id: number;
  isPrivate: boolean;
  name: string;
  optionValue: IOptionValue[];
}

export interface IProducts {
  id: number;
  thumbnailImage: string;
  price: number | null;
  engName: string;
  korName: string;
  brand: IBrand;
  category: ICategory;
  colorKorName: string;
  colorEngName: string;
  productOptionMappings: IProductOptionMapping[];
}

export interface IRecentProduct {
  id: number;
  thumbnailImage?: string;
  price: number | null;
  hit: number | null;
  engName: string;
  korName: string;
  brand: Pick<IBrand, 'id' | 'korName' | 'engName'>;
  category: Pick<ICategory, 'id' | 'korName' | 'engName'>;
  subCategory: Pick<ISubCategory, 'id' | 'engName' | 'korName' | 'categoryId'>;
  _count: {
    reviews: number;
    productLike: number;
  };
}

export type IRecommendProduct = Pick<IProducts, 'id' | 'korName' | 'engName' | 'thumbnailImage' | 'price' | 'brand'>;
