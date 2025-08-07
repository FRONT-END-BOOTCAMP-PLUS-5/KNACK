import { GetProductUseCase } from '@/backend/products/applications/usecases/GetProductUseCase';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get('id')) || 0;

  try {
    const productRepository = new PrProductRepository();
    const product = await new GetProductUseCase(productRepository).execute(id);

    return NextResponse.json({ result: product, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
