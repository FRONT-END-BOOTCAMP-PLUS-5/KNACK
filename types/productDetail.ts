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
    productLike: number;
  };
  // 리뷰 통계 관련 필드 추가
  averageRating?: number;
  ratingDistribution?: {
    [key: number]: { count: number; percent: number };
  };
  questionAnswers?: {
    [question: string]: {
      [answer: string]: {
        count: number;
        percent: number;
      };
    };
  };
}

export interface IBrand {
  id: number;
  korName: string;
  engName: string;
  logoImage: string;
  _count: {
    brandLike: number;
  };
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

// TextReview 컴포넌트에서 사용하는 타입
export interface ITextReviewData {
  _count: { reviews: number };
  averageRating?: number;
  ratingDistribution?: { [key: number]: { count: number; percent: number } };
  questionAnswers?: {
    [question: string]: {
      [answer: string]: {
        count: number;
        percent: number;
      };
    };
  };
  category: { id: number };
}
