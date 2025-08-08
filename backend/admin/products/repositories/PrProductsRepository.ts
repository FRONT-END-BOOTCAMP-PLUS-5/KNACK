import prisma from '@/backend/utils/prisma';
import { ProductRepository } from '../domains/repositories/ProductRepository';
import { IPostProductDto } from '../applications/dtos/PostProductDto';

export class PrProductRepository implements ProductRepository {
  private productData;

  constructor(productData: IPostProductDto) {
    this.productData = productData;
  }

  async insertProduct(): Promise<number> {
    const {
      brandId,
      categoryId,
      engName,
      gender,
      korName,
      price,
      thumbnailImage,
      subImages,
      subCategoryId,
      colorEngName,
      colorKorName,
      modelNumber,
      releaseDate,
      keywordColorId,
    } = this.productData;

    const result = await prisma.product.create({
      data: {
        engName: engName ?? '',
        korName: korName ?? '',
        price: price,
        gender: gender,
        brandId: brandId ?? 0,
        categoryId: categoryId ?? 0,
        thumbnailImage: thumbnailImage,
        subImages: subImages,
        subCategoryId: subCategoryId,
        colorEngName: colorEngName,
        colorKorName: colorKorName,
        modelNumber: modelNumber,
        releaseDate: releaseDate,
        keywordColorId: keywordColorId,
      },
    });

    return result.id;
  }
}
