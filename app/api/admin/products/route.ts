import { CreateProductUseCase } from '@/backend/admin/products/applications/usecases/CreateProductUseCase';
import { PrProductRepository } from '@/backend/admin/products/repositories/PrProductsRepository';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const productRepository = new PrProductRepository(body);
    const product = new CreateProductUseCase(productRepository).create();

    return NextResponse.json({ result: product, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
