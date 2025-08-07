export interface IProduct {
  id: number;
  descriptionText: string | null;
  thumbnailImage: string;
  subImages: string | null;
  price: number | null;
  discountPercent: number | null;
  detailImages: string | null;
  brandId: number | null;
  categoryId: number | null;
  isRecommended: boolean | null;
  isPrivate: boolean | null;
  createdAt: Date;
  gender: string;
  hit: number | null;
  engName: string | null;
  korName: string | null;
  colorKorName: string;
  colorEngName: string;
  modelNumber: number;
  releaseDate: Date;
  subCategoryId: number;
  topImages: string | null;
}
