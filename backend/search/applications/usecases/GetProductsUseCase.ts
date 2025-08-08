import { ProductSearchRepository } from '@/backend/search/domains/repositories/ProductSearchRepository';
import { GetProductsRequestDto, GetProductsResponseDto } from '@/backend/search/applications/dtos/GetProductsDto';
import { ProductFilters, PaginationParams } from '@/backend/search/domains/entities/ProductFilters';

export class GetProductsUseCase {
  constructor(private productSearchRepository: ProductSearchRepository) {}

  async execute(request: GetProductsRequestDto): Promise<GetProductsResponseDto> {
    // 기본값
    const limit = request.limit || 20;
    const page = request.page || 1;
    const offset = request.offset || (page - 1) * limit;
    const sort = request.sort || 'latest';

    const filters: ProductFilters = {
      keyword: request.keyword,
      keywordColorId: request.keywordColorId,
      brandId: request.brandId,
      categoryId: request.categoryId,
      subCategoryId: request.subCategoryId,
      priceMin: request.priceMin,
      priceMax: request.priceMax,
      discountMin: request.discountMin,
      discountMax: request.discountMax,
      // size: request.size,
      benefit: request.benefit,
      gender: request.gender,
      soldOutInvisible: request.soldOutInvisible,
    };

    const pagination: PaginationParams = {
      cursor: request.cursor,
      offset,
      limit,
      page,
    };

    const result = await this.productSearchRepository.getProducts({
      filters,
      sort,
      pagination,
    });

    return {
      products: result.products,
      pageInfo: result.pageInfo,
      pagination: result.pagination,
    };
  }
}
