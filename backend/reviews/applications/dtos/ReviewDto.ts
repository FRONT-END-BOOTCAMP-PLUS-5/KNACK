// 프론트에 전달할 리뷰 데이터 형식 (최적화)
export interface ReviewDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  size: string;
}

export interface MyReviewDto {
  orderId: number;
  productId: number;
  productName: string;
  productEngName: string;
  thumbnailImage: string;
  size: string;
  review: {
    contents: string;
    rating: number;
    createdAt: Date;
  };
}

// Review 테이블 중심 조회를 위한 타입 정의
export interface ReviewWithRelations {
  id: number;
  contents: string;
  rating: number;
  createdAt: Date;
  order: {
    id: number;
    optionValue?: {
      name: string;
    };
  };
  product: {
    id: number;
    korName: string;
    engName: string;
    thumbnailImage?: string;
  };
}

// Order 테이블 중심 조회를 위한 타입 정의 (리뷰 존재 여부 포함)
export interface OrderWithReviewStatus {
  id: number;
  userId: string;
  productId: number;
  product: {
    id: number;
    thumbnailImage?: string;
    engName: string;
    korName: string;
  };
  optionValue?: {
    name: string;
  };
  review?: {
    id: number;
  };
}
