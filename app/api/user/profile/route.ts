import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

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
      }
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
