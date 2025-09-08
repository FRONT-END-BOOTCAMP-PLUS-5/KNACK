export interface CreateOrderEntityDto {
  userId: string;
  count: number;
  price: number;
  salePrice: number;
  deliveryStatus: DeliveryStatus;
  couponPrice: number;
  point: number;
  brandName: string;
  categoryName: string;
  colorEngName: string;
  colorKorName: string;
  engName: string;
  korName: string;
  gender: string;
  optionName: string;
  optionValue: string;
  releaseDate?: string;
  subCategoryName: string;
  thumbnailImage: string;
}

export enum DeliveryStatus {
  PAID = 1,
  CONFIRMED = 2,
  DELIVERING = 3,
  COMPLETED = 4,
}
