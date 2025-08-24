export interface BrandLike {
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
  price: number | null;
}
