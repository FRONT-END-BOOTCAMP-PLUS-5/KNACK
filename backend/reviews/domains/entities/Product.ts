// DB Column 데이터 타입
export interface Product {
  id: number;
  thumbnailImage: string;
  engName: string;
  korName: string;
  category?: {
    engName: string;
    korName: string;
  };
  brand?: {
    engName: string;
    korName: string;
  };
}
