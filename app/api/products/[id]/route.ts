import { GetProductUseCase } from '@/backend/products/applications/usecases/GetProductUseCase';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const param = await params;
  const id = param?.id;

  try {
    const productRepository = new PrProductRepository();
    const product = await new GetProductUseCase(productRepository).execute(Number(id));

    return NextResponse.json({ result: product, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
