export interface Like {
  id: number;
  product: Product;
  createdAt?: Date | null;
}

interface Product {
  thumbnailImage: string;
  korName: string;
  engName: string;
  id: number;
  price: number | null;
  productOptionMappings: OptionMappings[];
}

interface OptionMappings {
  optionType: {
    optionValue: {
      id: number;
      isPrivate: boolean;
      name: string;
      typeId: number;
    }[];
  };
}
