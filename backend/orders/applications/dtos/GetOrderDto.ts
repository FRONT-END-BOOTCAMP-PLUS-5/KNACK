export interface OrderDto {
  id: number;
  paymentId: number | null;
  createdAt?: Date | null;
  korName: string;
  engName: string;
  thumbnailImage: string;
  price: number | null;
}
