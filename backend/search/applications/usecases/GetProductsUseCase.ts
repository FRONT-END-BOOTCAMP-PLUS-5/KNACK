import { ProductSearchRepository } from '@/backend/search/domains/repositories/ProductSearchRepository';
import { GetProductsRequestDto, GetProductsResponseDto } from '@/backend/search/applications/dtos/GetProductsDto';
import { ProductFilters, PaginationParams } from '@/backend/search/domains/entities/ProductFilters';
import { PriceParser } from '@/backend/utils/search/priceParcer';

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
      priceMin: PriceParser.parse(request.price).min,
      priceMax: PriceParser.parse(request.price).max,
      discountMin: PriceParser.parse(request.discount).min,
      discountMax: PriceParser.parse(request.discount).max,
      size: request.size,
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
