import { GetCategoryUseCase } from '@/backend/categories/applications/usecases/GetCategoryUsecase';
import { PrCategoryRepository } from '@/backend/categories/repositories/PrCategoryRepository';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categoryRepository = new PrCategoryRepository();
    const categories = await new GetCategoryUseCase(categoryRepository).execute();

    return NextResponse.json({ result: categories, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
  }
}
