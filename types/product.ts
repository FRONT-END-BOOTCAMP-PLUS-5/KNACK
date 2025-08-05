import { IBrand } from './brand';
import { ICategory } from './category';

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
