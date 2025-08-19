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

export interface IBrandLikeList {
  id: number;
  brand: Brand;
}

interface Brand {
  engName: string;
  korName: string;
  logoImage: string;
  id: number;
  _count: {
    brandLike: number;
  };
  products: Product[];
}

interface Product {
  korName: string;
  engName: string;
  id: number;
  thumbnailImage: string;
  price: number;
}
