import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/auth';
import { PrBrandLikesRepository } from '@/backend/brand-likes/repositories/PrBrandLikesRepository';
import { CreateBrandLikesUseCase } from '@/backend/brand-likes/applications/usecases/CreateBrandLikesUseCase';
import { DeleteBrandLikesUseCase } from '@/backend/brand-likes/applications/usecases/DeleteBrandLikesUseCase';
import { GetBrandLikesUseCase } from '@/backend/brand-likes/applications/usecases/GetBrandLikesUseCase';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const brandLikesRepository = new PrBrandLikesRepository();
    const brandLikes = new CreateBrandLikesUseCase(brandLikesRepository).insert(session.user.id, body.id);

    return NextResponse.json({ result: brandLikes, status: 200 });
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

    const brandLikesRepository = new PrBrandLikesRepository();
    const brandLikes = new DeleteBrandLikesUseCase(brandLikesRepository).delete(body.id, session?.user?.id);

    return NextResponse.json({ result: brandLikes, status: 200 });
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
    const brandLikesRepository = new PrBrandLikesRepository();
    const brandLikes = await new GetBrandLikesUseCase(brandLikesRepository).findById(session.user.id);

    return NextResponse.json({ result: brandLikes, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 503 });
    }
  }
}
