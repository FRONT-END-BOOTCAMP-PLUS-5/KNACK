// 프론트에 전달할 리뷰 데이터 형식
export interface ReviewDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  category: {
    engName: string;
    korName: string;
  } | undefined;
  size: string;
  hasReview: boolean;
  review?: {
    contents: string;
    rating: number;
    reviewImages?: string;
    createdAt: Date;
  };
}

export interface MyReviewDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  category: {
    engName: string;
    korName: string;
  } | undefined;
  size: string;
  review: {
    contents: string;
    rating: number;
    reviewImages?: string;
    createdAt: Date;
  };
}
