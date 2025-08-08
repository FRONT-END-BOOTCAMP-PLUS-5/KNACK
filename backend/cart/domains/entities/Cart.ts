export interface Cart {
  id: number;
  userId: string;
  productId: number;
  optionValueId: number;
  createdAt: Date | null;
  count: number | null;
}
