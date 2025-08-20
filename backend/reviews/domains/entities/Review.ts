export interface Review {
  id: number;
  userId: string;
  productId: number;
  orderId: number;
  contents: string;
  rating: number;
  reviewImages?: string;
  createdAt: Date;
}
