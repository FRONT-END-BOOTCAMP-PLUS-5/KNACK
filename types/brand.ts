export interface IBrand {
  id: number;
  engName: string;
  korName: string;
  isPrivate: boolean;
  logoImage?: string;
}

export interface IBrandList {
  id: number;
  engName: string;
  korName: string;
  logoImage: string;
  likesCount: number;
  isLiked: boolean;
}

export interface IBrandWithTagList {
  tag: string;
  brandList: IBrandList[];
}
