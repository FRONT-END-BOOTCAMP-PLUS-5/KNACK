export interface ILikeRef {
  productId: number;
  optionValueId: number;
}

export interface ILikeList {
  id: number;
  product: Product;
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
  thumbnailImage: string;
  korName: string;
  engName: string;
  id: number;
  price: number | null;
  productOptionMappings: OptionMappings[];
}

interface OptionMappings {
  optionType: {
    optionValue: {
      id: number;
      isPrivate: boolean;
      name: string;
      typeId: number;
    }[];
  };
}
