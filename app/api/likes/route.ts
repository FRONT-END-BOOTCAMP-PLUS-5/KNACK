import { CreateLikesUseCase } from '@/backend/likes/applications/usecases/CreateLikesUseCase';
import { PrLikesRepository } from '@/backend/likes/repositories/PrLikesRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const likeRepository = new PrLikesRepository(body);
    const likes = new CreateLikesUseCase(likeRepository).insert();

    return NextResponse.json({ result: likes, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
