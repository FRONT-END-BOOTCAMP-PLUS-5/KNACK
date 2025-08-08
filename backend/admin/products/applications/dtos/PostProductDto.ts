export interface IPostProductDto {
  id: number;
  descriptionText: string;
  thumbnailImage: string;
  subImages: string;
  price: number;
  discountPercent: number;
  detailImages: string;
  brandId: number;
  categoryId: number;
  isRecommended: boolean;
  isPrivate: boolean;
  createdAt: Date;
  gender: string;
  hit: number;
  engName: string;
  korName: string;
  colorKorName: string;
  colorEngName: string;
  modelNumber: string;
  releaseDate: string;
  subCategoryId: number;
  topImages: string;
  keywordColorId: number;
}
