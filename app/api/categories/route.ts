import { GetCategoryUseCase } from '@/backend/categories/applications/usecases/GetCategoryUsecase';
import { PrCategoryRepository } from '@/backend/categories/repositories/PrCategoryRepository';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categoryRepository = new PrCategoryRepository();
    const categories = await new GetCategoryUseCase(categoryRepository).execute();

    return NextResponse.json(categories);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 503 });
    }
  }
}
