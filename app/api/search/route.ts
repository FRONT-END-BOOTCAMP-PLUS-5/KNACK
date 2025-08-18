import { NextRequest, NextResponse } from 'next/server';
import { GetProductsUseCase } from '@/backend/search/applications/usecases/GetProductsUseCase';
import { PrProductsRepository } from '@/backend/search/infrastructure/repositories/PrProductsRepository';
import { GetProductsRequestDto } from '@/backend/search/applications/dtos/GetProductsDto';
import { SortOption } from '@/backend/search/domains/entities/ProductFilters';
import { getBooleanParam, getIntParam, getIntArrayParam, getStringArrayParam } from '@/utils/searchParams';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestDto: GetProductsRequestDto = {
      keyword: searchParams.get('keyword') || undefined,

      keywordColorId: getIntArrayParam(searchParams, 'keywordColorId'),
      brandId: getIntArrayParam(searchParams, 'brandId'),
      categoryId: getIntArrayParam(searchParams, 'categoryId'),
      subCategoryId: getIntArrayParam(searchParams, 'subCategoryId'),
      price: searchParams.get('price') || undefined,
      discount: searchParams.get('discount') || undefined,
      size: getStringArrayParam(searchParams, 'size'),
      benefit: (searchParams.get('benefit') as 'under_price') || undefined,
      gender: searchParams.get('gender') || undefined,
      soldOutInvisible: getBooleanParam(searchParams, 'soldOutInvisible'),

      sort: (searchParams.get('sort') as SortOption) || 'latest',

      cursor: searchParams.get('cursor') || undefined,
      offset: getIntParam(searchParams, 'offset'),
      limit: getIntParam(searchParams, 'limit'),
      page: getIntParam(searchParams, 'page'),
    };

    const repository = new PrProductsRepository();
    const useCase = new GetProductsUseCase(repository);
    const result = await useCase.execute(requestDto);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
