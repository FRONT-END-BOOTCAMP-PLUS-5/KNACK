import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { PrUserRepository } from '@/backend/user/repositories/PrUserRepository';
import { UpdateUserUseCase } from '@/backend/user/applications/usecases/UpdateUserUseCase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    // Prisma users 테이블에서 모든 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
        createdAt: true,
        marketing: true,
        sns: true,
        profileImage: true,
        point: true,
        isActive: true,
        nickname: true,
        // password는 보안상 제외
      },
    });

    if (!user) {
      return Response.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return Response.json({ user });
  } catch (error) {
    console.error('사용자 정보 조회 에러:', error);
    return Response.json({ error: '사용자 정보 조회 실패' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const userRepository = new PrUserRepository(body);
    const user = await new UpdateUserUseCase(userRepository).update(session?.user?.id);

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 500 });
    }
  }
}
