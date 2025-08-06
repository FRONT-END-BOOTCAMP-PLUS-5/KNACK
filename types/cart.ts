import { IProduct, IProductOptionMapping } from './product';

export interface CartRef {
  userId: string;
  productId: number;
  optionValueId: number;
  count: number;
}

export interface ICart {
  count: number;
  id: number;
  createdAt: Date;
  optionMappingId: number;
  product: IProduct;
  productOptionMapping: IProductOptionMapping;
  userId: string;
}
