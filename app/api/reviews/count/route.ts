import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import prisma from '@/backend/utils/prisma';

export async function GET() {
  try {
    // 사용자 인증 확인
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 해당 사용자의 리뷰 개수 조회
    const reviewCount = await prisma.review.count({
      where: { userId }
    });

    return NextResponse.json({
      success: true,
      reviewCount
    });

  } catch (error) {
    console.error('리뷰 개수 조회 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '리뷰 개수를 조회할 수 없습니다.' 
      },
      { status: 500 }
    );
  }
}
