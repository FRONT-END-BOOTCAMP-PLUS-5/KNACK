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
