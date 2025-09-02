import { DeletesCartUseCase } from '@/backend/cart/applications/usecases/DeletesCartUseCase';
import { PrCartRepository } from '@/backend/cart/repositories/PrCartRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cartRepository = new PrCartRepository(body);
    const cart = await new DeletesCartUseCase(cartRepository).delete(body.ids);

    return NextResponse.json({ result: cart, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
