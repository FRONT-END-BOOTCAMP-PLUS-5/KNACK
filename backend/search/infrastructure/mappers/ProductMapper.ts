import { Product } from '@/backend/search/domains/entities/Product';
import { ProductDto } from '@/backend/search/applications/dtos/GetProductsDto';

export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      descriptionText: product.descriptionText,
      thumbnailImage: product.thumbnailImage,
      subImages: product.subImages,
      price: product.price,
      discountPercent: product.discountPercent,
      detailContents: product.detailContents,
      brandId: product.brandId,
      categoryId: product.categoryId,
      isRecommended: product.isRecommended,
      isPrivate: product.isPrivate,
      createdAt: product.createdAt,
      gender: product.gender,
      hit: product.hit,
      engName: product.engName,
      korName: product.korName,
      brand: product.brand,
      categories: product.categories,
      subCategories: product.subCategories,
      reviewsCount: product.reviewsCount,
      likesCount: product.likesCount,
    };
  }

  static toDtoList(products: Product[]): ProductDto[] {
    return products.map((product) => this.toDto(product));
  }
}
