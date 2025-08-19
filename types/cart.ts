import { IProduct } from './product';

export interface CartRef {
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
}
