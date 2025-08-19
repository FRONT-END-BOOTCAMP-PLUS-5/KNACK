import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { GetReviewableOrdersUseCase } from '../../../../backend/reviews/applications/usecases/GetReviewableOrdersUseCase';
import { GetMyReviewsUseCase } from '../../../../backend/reviews/applications/usecases/GetMyReviewsUseCase';
import { PrismaReviewRepository } from '../../../../backend/reviews/repositories/reviewRepository';
import { PrismaOrderRepository } from '../../../../backend/reviews/repositories/reviewRepository';

export async function GET(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인 (세션에서 사용자 ID 추출)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 백엔드 usecase 인스턴스 생성
    const reviewRepository = new PrismaReviewRepository();
    const orderRepository = new PrismaOrderRepository();
    const getReviewableOrdersUseCase = new GetReviewableOrdersUseCase(reviewRepository, orderRepository);
    const getMyReviewsUseCase = new GetMyReviewsUseCase(reviewRepository, orderRepository);

    // 3. 사용자 ID로 주문 데이터 조회
    const userId = session.user.id;
    
    // 세션에 사용자 ID가 없으면 에러 반환
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }
    
    const reviewableOrders = await getReviewableOrdersUseCase.execute(userId);
    const myReviews = await getMyReviewsUseCase.execute(userId);

    // 4. 응답 데이터 구성
    return NextResponse.json({
      success: true,
      data: {
        reviewableOrders,
        myReviews,
        message: '데이터 조회 완료'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
