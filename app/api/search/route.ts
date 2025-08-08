import { NextRequest, NextResponse } from 'next/server';
import { GetProductsUseCase } from '@/backend/search/applications/usecases/GetProductsUseCase';
import { PrProductsRepository } from '@/backend/search/infrastructure/repositories/PrProductsRepository';
import { GetProductsRequestDto } from '@/backend/search/applications/dtos/GetProductsDto';
import { SortOption } from '@/backend/search/domains/entities/ProductFilters';
import prisma from '@/backend/utils/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestDto: GetProductsRequestDto = {
      keyword: searchParams.get('keyword') || undefined,

      keywordColorId: searchParams.get('keywordColorId') ? parseInt(searchParams.get('keywordColorId')!) : undefined,
      brandId: searchParams.get('brandId') ? parseInt(searchParams.get('brandId')!) : undefined,
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
      subCategoryId: searchParams.get('subCategoryId') ? parseInt(searchParams.get('subCategoryId')!) : undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      discountMin: searchParams.get('discountMin') ? parseInt(searchParams.get('discountMin')!) : undefined,
      discountMax: searchParams.get('discountMax') ? parseInt(searchParams.get('discountMax')!) : undefined,
      // size: searchParams.get('size') || undefined,
      benefit: (searchParams.get('benefit') as 'under_price') || undefined,
      gender: searchParams.get('gender') || undefined,
      soldOutInvisible: searchParams.get('soldOutInvisible') === 'true' ? true : false,

      sort: (searchParams.get('sort') as SortOption) || 'latest',

      cursor: searchParams.get('cursor') || undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
    };

    const repository = new PrProductsRepository(prisma);
    const useCase = new GetProductsUseCase(repository);
    const result = await useCase.execute(requestDto);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
