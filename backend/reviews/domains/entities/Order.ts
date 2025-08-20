export interface Order {
  id: number;
  userId: string;
  productId: number;
  product?: {
    id: number;
    thumbnailImage?: string;
    engName: string;
    korName: string;
  };
  optionValue?: {
    name: string;
  };
  review?: {
    id: number;
  };
}
