import { GetBrandUseCase } from '@/backend/brands/applications/usecases/GetBrandUsecase';
import { PrBrandRepository } from '@/backend/brands/repositories/PrBrandRepository';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? undefined;
  const key = searchParams.get('key') ?? undefined;

  try {
    const brandRepository = new PrBrandRepository();
    const brands = await new GetBrandUseCase(brandRepository).execute({ keyword, key, userId });
    return NextResponse.json(brands);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 503 });
    }
  }
}
