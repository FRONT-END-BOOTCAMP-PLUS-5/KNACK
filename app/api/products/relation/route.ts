import { GetRelationProductsUseCase } from '@/backend/products/applications/usecases/GetRelationProductsUseCase';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams?.get('id');

  console.log('========================');
  console.log('params', id);
  console.log('========================');

  try {
    const productRepository = new PrProductRepository();
    const products = await new GetRelationProductsUseCase(productRepository).execute(Number(id));

    return NextResponse.json({ result: products, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
