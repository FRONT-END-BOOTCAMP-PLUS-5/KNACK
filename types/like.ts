export interface ILikeRef {
  productId: number;
  optionValueId: number;
}

export interface ILikeList {
  id: number;
  userId: string;
  productId: number;
  optionValueId: number;
  createdAt?: Date | null;
}
