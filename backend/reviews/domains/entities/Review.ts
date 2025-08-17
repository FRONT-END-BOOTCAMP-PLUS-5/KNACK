// DB Column 데이터 타입
export interface Review {
  id?: number;
  userId: string;
  productId: number;
  orderId?: number; // orderId 필드 추가 (선택적)
  contents: string;
  rating: number;
  reviewImages?: string;
  createdAt: Date;
}
