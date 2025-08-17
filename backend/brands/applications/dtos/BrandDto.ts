export interface BrandRequestDto {
  keyword?: string;
  key?: string;
}

export interface BrandResponseDto {
  id: number;
  korName: string;
  engName: string;
  logoImage: string;
  likesCount: number;
}

export interface BrandWithTagListDto {
  tag: string;
  brandList: BrandResponseDto[];
}
