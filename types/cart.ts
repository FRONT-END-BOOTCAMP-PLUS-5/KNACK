import { IProduct, IProductOptionMapping } from './product';

export interface CartRef {
  userId: string;
  productId: number;
  optionValueId: number;
  count: number;
  id: number;
}

export interface ICart {
  count: number;
  id: number;
  createdAt?: Date;
  optionValueId: number;
  product?: IProduct;
  userId?: string;
}
