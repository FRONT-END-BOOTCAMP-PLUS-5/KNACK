import { GetBrandUseCase } from '@/backend/brands/applications/usecases/GetBrandUsecase';
import { PrBrandRepository } from '@/backend/brands/repositories/PrBrandRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? undefined;
  const key = searchParams.get('key') ?? undefined;

  try {
    const brandRepository = new PrBrandRepository();
    const brands = await new GetBrandUseCase(brandRepository).execute({ keyword, key });
    return NextResponse.json(brands);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 503 });
    }
  }
}
