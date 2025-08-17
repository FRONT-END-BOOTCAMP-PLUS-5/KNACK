import { Product } from './Product';

// DB Column 데이터 타입
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
  product?: Product;
}
