import { NextRequest, NextResponse } from 'next/server';
import { GetFilterCountsUseCase } from '@/backend/filter-counts/applications/usecases/GetFilterCountsUseCase';
import { PrFilterCountsRepository } from '@/backend/filter-counts/repositories/PrFilterCountsRepository';
import { GetFilterCountsRequestDto } from '@/backend/filter-counts/applications/dtos/GetFilterCountsDto';
import { getBooleanParam, getIntArrayParam, getStringArrayParam } from '@/utils/searchParams';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestDto: GetFilterCountsRequestDto = {
      keyword: searchParams.get('keyword') || undefined,

      keywordColorId: getIntArrayParam(searchParams, 'keywordColorId'),
      brandId: getIntArrayParam(searchParams, 'brandId'),
      categoryId: getIntArrayParam(searchParams, 'categoryId'),
      subCategoryId: getIntArrayParam(searchParams, 'subCategoryId'),
      price: searchParams.get('price') || undefined,
      discount: searchParams.get('discount') || undefined,
      size: getStringArrayParam(searchParams, 'size'),
      benefit: getBooleanParam(searchParams, 'benefit'),
      gender: searchParams.get('gender') || undefined,
      soldOutInvisible: getBooleanParam(searchParams, 'soldOutInvisible'),
    };

    const repository = new PrFilterCountsRepository();
    const useCase = new GetFilterCountsUseCase(repository);
    const result = await useCase.execute(requestDto);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching filter counts:', error);
    return NextResponse.json({ error: 'Failed to fetch filter counts' }, { status: 500 });
  }
}
