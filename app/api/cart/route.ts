import { CreateCartUseCase } from '@/backend/cart/applications/usecases/CreateCartUseCase';
import { DeleteCartUseCase } from '@/backend/cart/applications/usecases/DeleteCartUseCase';
import { GetCartUseCase } from '@/backend/cart/applications/usecases/GetCartUseCase';
import { PrCartRepository } from '@/backend/cart/repositories/PrCartRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cartRepository = new PrCartRepository(body);
    const cart = new CreateCartUseCase(cartRepository).create();

    return NextResponse.json({ result: cart, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}

export async function GET() {
  try {
    const cartRepository = new PrCartRepository();
    const cart = await new GetCartUseCase(cartRepository).execute();

    return NextResponse.json({ result: cart, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}

export async function DELETE(request: NextRequest) {
  const url: URL = new URL(request.url);
  const param: string = url.searchParams.get('id') || '0';

  try {
    const cartRepository = new PrCartRepository();
    const cart = await new DeleteCartUseCase(cartRepository).delete(Number(param));

    return NextResponse.json({ result: cart });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
