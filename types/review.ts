// 리뷰 관련 타입 정의
export interface ReviewOrderDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  category: {
    engName: string;
    korName: string;
  } | undefined;
  optionValue?: {
    id: number;
    name: string;
    typeId: number;
  };
  size?: string;
  hasReview: boolean;
  review?: {
    contents: string;
    rating: number;
    reviewImages?: string;
    createdAt: Date;
  };
}

export interface ReviewQuestion {
  question: string;
  options: string[];
}

export interface ReviewQuestions {
  [key: number]: ReviewQuestion[];
}

export interface CreateReviewData {
  userId: string;
  productId: number;
  orderId: number;
  contents: string;
  rating: number;
  reviewImages?: string;
}
