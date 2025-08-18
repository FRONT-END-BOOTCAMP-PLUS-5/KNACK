import { GetRecentlyProductUseCase } from '@/backend/products/applications/usecases/GetRecentlyProductUseCase';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.getAll('id');
  const ids = params.map(Number);

  try {
    const productRepository = new PrProductRepository();
    const products = await new GetRecentlyProductUseCase(productRepository).execute(ids);

    return NextResponse.json({ result: products, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
