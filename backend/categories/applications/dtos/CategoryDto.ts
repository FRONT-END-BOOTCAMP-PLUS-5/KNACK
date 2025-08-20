export interface CategoryResponseDto {
  id: number;
  korName: string;
  engName: string;
  subCategories: SubCategoryDto[];
}

export interface SubCategoryDto {
  id: number;
  korName: string;
  engName: string;
  image?: string;
  categoryId: number;
}
