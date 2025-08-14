export interface CategoryDto {
  id: number;
  korName: string;
  engName: string;
  subCategories: SubCategoryDto[];
}

export interface SubCategoryDto {
  id: number;
  korName: string;
  engName: string;
}

export interface CategoryResponseDto {
  categories: CategoryDto[];
}
