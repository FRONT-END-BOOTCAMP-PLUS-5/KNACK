import { CreateLikesUseCase } from '@/backend/likes/applications/usecases/CreateLikesUseCase';
import { DeleteLikesUseCase } from '@/backend/likes/applications/usecases/DeleteLikesUseCase';
import { GetLikesUseCase } from '@/backend/likes/applications/usecases/GetLikesUseCase';
import { PrLikesRepository } from '@/backend/likes/repositories/PrLikesRepository';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const likeRepository = new PrLikesRepository();
    const likes = new CreateLikesUseCase(likeRepository).insert(session.user.id, body.productId);

    return NextResponse.json({ result: likes, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const likeRepository = new PrLikesRepository();
    const likes = new DeleteLikesUseCase(likeRepository).delete(body.id, session?.user?.id);

    return NextResponse.json({ result: likes, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 503 });
    }
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const likeRepository = new PrLikesRepository();
    const likes = await new GetLikesUseCase(likeRepository).findById(session.user.id);

    return NextResponse.json({ result: likes, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 503 });
    }
  }
}
