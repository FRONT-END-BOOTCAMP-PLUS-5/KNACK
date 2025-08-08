import { IProductOptionMapping } from './product';

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

export interface IBrand {
  id: number;
  korName: string;
  engName: string;
  logoImage: string;
}

export interface ICategory {
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

export interface IReview {
  contents: string;
  rating: number | null;
  reviewImages: string | null;
  createdAt: Date | null;
}
