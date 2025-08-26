import { GetRecommendProdcutsUseCase } from '@/backend/products/applications/usecases/GetRecomendProducts';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productRepository = new PrProductRepository();
    const products = await new GetRecommendProdcutsUseCase(productRepository).execute();

    return NextResponse.json({ result: products, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
