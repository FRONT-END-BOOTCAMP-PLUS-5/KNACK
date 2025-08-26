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

interface IBrand {
  id: number;
  korName: string;
  engName: string;
  logoImage: string;
}

interface ICategory {
  id: number;
  engName: string;
  korName: string;
  subCategories: ISubCategory[];
}

interface ISubCategory {
  id: number;
  engName: string;
  korName: string;
  categoryId: number;
}

interface IProductOptionMapping {
  optionType: IOptionType;
}

interface IOptionValue {
  id: number;
  isPrivate: boolean;
  name: string;
  typeId: number;
}

interface IOptionType {
  id: number;
  isPrivate: boolean;
  name: string;
  optionValue: IOptionValue[];
}

export type IRecommendProducts = Pick<IProducts, 'engName' | 'korName' | 'id' | 'price' | 'thumbnailImage' | 'brand'>;
