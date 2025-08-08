export interface IProduct {
  id: number;
  descriptionText: string | null;
  thumbnailImage: string;
  subImages: string | null;
  price: number | null;
  discountPercent: number | null;
  detailImages: string | null;
  isRecommended: boolean;
  createdAt: Date | null;
  gender: string | null;
  hit: number | null;
  engName: string;
  korName: string;
  brand: IBrand;
  category: ICategory;
  colorKorName: string;
  colorEngName: string;
  modelNumber: string | null;
  releaseDate: string | null;
  topImages: string | null;
  reviews: IReview[];
  productOptionMappings: IProductOptionMapping[];
  _count: {
    reviews: number;
  };
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

interface IReview {
  contents: string;
  rating: number | null;
  reviewImages: string | null;
  createdAt: Date | null;
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
