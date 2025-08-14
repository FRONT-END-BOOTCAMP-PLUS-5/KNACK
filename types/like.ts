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

export interface IBrandList {
  id: number;
  userId: string;
  BrandId: number;
  createdAt?: Date | null;
}
