// 리뷰 도메인 모델
export interface Review {
  userId: string;
  productId: number;
  contents: string;
  rating: number;
  reviewImages?: string;
  createdAt: Date;
}

// 주문 도메인 모델
export interface Order {
  id: number;
  userId: string;
  productId: number;
  price: number;
  salePrice: number;
  tracking?: string;
  createdAt: Date;
  deliveryStatus: number;
  count: number;
  paymentId?: number;
  product?: Product; // Product 정보 포함
}

// 리뷰 가능한 주문 정보
export interface Product {
  id: number;
  thumbnailImage: string;
  engName: string;
  korName: string;
  size?: string;
  category?: {
    engName: string;
    korName: string;
  };
}

export interface ReviewableOrder {
  order: Order;
  product: Product;
  hasReview: boolean;
  review?: Review;
}

// 리뷰 도메인 서비스 인터페이스
export interface ReviewDomainService {
  isReviewable(order: Order): boolean;
  calculateReviewScore(review: Review): number;
}
