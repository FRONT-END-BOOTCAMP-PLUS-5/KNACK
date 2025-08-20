// 리뷰 관련 타입 정의
export interface ReviewOrderDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  size?: string;
}

export interface MyReviewDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  size?: string;
  review: {
    contents: string;
    rating: number;
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
