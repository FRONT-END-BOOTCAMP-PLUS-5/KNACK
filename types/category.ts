export interface ICategory {
  id: number;
  engName: string;
  korName: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface ISubCategory {
  id: number;
  categoryId: number;
  engName: string;
  korName: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface IPageCategory {
  id: number;
  korName: string;
  engName: string;
  subCategories: IPageSubCategory[];
}

export interface IPageSubCategory {
  id: number;
  categoryId: number;
  korName: string;
  engName: string;
  image: string;
}
