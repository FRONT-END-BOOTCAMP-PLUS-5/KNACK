export interface GetFilterCountsRequestDto {
  keyword?: string;

  keywordColorId?: number[];
  brandId?: number[];
  categoryId?: number[];
  subCategoryId?: number[];
  price?: string;
  discount?: string;
  size?: string[];
  benefit?: boolean;
  gender?: string;
  soldOutInvisible?: boolean;
}

export interface GetFilterCountsResponseDto {
  totalCount: number;
}
