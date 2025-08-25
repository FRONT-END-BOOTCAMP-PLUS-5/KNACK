export interface BrandRequestDto {
  keyword?: string;
  key?: string;
  userId?: string;
}

export interface BrandResponseDto {
  id: number;
  korName: string;
  engName: string;
  logoImage: string;
  likesCount: number;
  isLiked: boolean;
}

export interface BrandWithTagListDto {
  tag: string;
  brandList: BrandResponseDto[];
}
