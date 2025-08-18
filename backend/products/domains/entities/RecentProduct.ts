export interface IRecentProduct {
  id: number;
  thumbnailImage?: string;
  price: number | null;
  hit: number | null;
  engName: string;
  korName: string;
  brand: IBrand;
  category: ICategory;
  subCategory: ISubCategory;
  _count: {
    reviews: number;
    productLike: number;
  };
}

interface IBrand {
  id: number;
  korName: string;
  engName: string;
}

interface ICategory {
  id: number;
  korName: string;
  engName: string;
}

interface ISubCategory {
  id: number;
  korName: string;
  engName: string;
  categoryId: number;
}
