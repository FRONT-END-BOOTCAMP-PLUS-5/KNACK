// DB Column 데이터 타입
export interface Review {
  id?: number;
  userId: string;
  productId: number;
  orderId: number; // orderId를 필수 필드로 변경 (undefined 제거)
  contents: string;
  rating: number;
  reviewImages?: string;
  createdAt: Date;
}
