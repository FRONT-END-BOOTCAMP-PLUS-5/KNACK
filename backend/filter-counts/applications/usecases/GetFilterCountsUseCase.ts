import { FilterCountsRepository } from '@/backend/filter-counts/domains/repositories/FilterCountsRepository';
import {
  GetFilterCountsRequestDto,
  GetFilterCountsResponseDto,
} from '@/backend/filter-counts/applications/dtos/GetFilterCountsDto';
import { ProductFilters } from '@/backend/search/domains/entities/ProductFilters';
import { parseNumberRange } from '@/utils/search/numberRange';

export class GetFilterCountsUseCase {
  constructor(private filterCountsRepository: FilterCountsRepository) {}

  async execute(request: GetFilterCountsRequestDto): Promise<GetFilterCountsResponseDto> {
    const filters: ProductFilters = {
      keyword: request.keyword,
      keywordColorId: request.keywordColorId,
      brandId: request.brandId,
      categoryId: request.categoryId,
      subCategoryId: request.subCategoryId,
      priceMin: parseNumberRange(request.price).min,
      priceMax: parseNumberRange(request.price).max === 10000000 ? undefined : parseNumberRange(request.price).max,
      discountMin: parseNumberRange(request.discount).min,
      discountMax: parseNumberRange(request.discount).max,
      size: request.size,
      benefit: request.benefit,
      gender: request.gender,
      soldOutInvisible: request.soldOutInvisible,
    };

    const totalCount = await this.filterCountsRepository.getPrivateProductCount(filters);

    return {
      totalCount,
    };
  }
}
