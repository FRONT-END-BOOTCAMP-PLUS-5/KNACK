import { GetOptionUseCase } from '@/backend/options/applications/usecases/GetOptionUsecase';
import { PrOptionRepository } from '@/backend/options/repositories/PrOptionRepository';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const optionRepository = new PrOptionRepository();
    const options = await new GetOptionUseCase(optionRepository).execute();

    return NextResponse.json(options);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 503 });
    }
  }
}
