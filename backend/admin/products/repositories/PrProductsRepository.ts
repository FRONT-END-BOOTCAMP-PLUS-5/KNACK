import prisma from '@/backend/utils/prisma';
import { ProductRepository } from '../domains/repositories/ProductRepository';

interface IProps {
  korName: string;
  engName: string;
  gender: string;
  categoryId: number;
  brandId: number;
  price: number;
  thumbnailImage: string;
  subImages: string;
}

export class PrProductRepository implements ProductRepository {
  private productData;

  constructor(productData: IProps) {
    this.productData = productData;
  }

  async insertProduct(): Promise<number> {
    const { brandId, categoryId, engName, gender, korName, price, thumbnailImage, subImages } = this.productData;

    const result = await prisma.product.create({
      data: {
        engName: engName,
        korName: korName,
        price: price,
        gender: gender,
        brandId: brandId,
        categoryId: categoryId,
        thumbnailImage: thumbnailImage,
        subImages: subImages,
      },
    });

    return result.id;
  }
}
