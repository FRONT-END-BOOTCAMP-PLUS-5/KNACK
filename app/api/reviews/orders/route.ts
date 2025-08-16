import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { ReviewServiceImpl } from '@/backend/reviews/applications/reviewService';
import { PrismaReviewRepository } from '@/backend/reviews/repositories/reviewRepository';
import { PrismaOrderRepository } from '@/backend/reviews/repositories/reviewRepository';

export async function GET(request: NextRequest) {
  try {
    console.log('🟢 API 호출 시작');
    
    // 1. 사용자 인증 확인 (세션에서 사용자 ID 추출)
    console.log('🔍 1단계: 사용자 인증 확인 시작');
    const session = await getServerSession(authOptions);
    console.log('🔍 세션 정보:', session);
    
    if (!session?.user?.email) {
      console.log('❌ 인증 실패: 세션 없음');
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    console.log('✅ 인증 성공:', session.user.email);

    // 2. 백엔드 서비스 인스턴스 생성
    console.log('🔍 2단계: 백엔드 서비스 생성 시작');
    const reviewRepository = new PrismaReviewRepository();
    const orderRepository = new PrismaOrderRepository();
    const reviewService = new ReviewServiceImpl(reviewRepository, orderRepository);
    console.log('✅ 백엔드 서비스 생성 완료');

    // 3. 사용자 ID로 주문 데이터 조회
    console.log('🔍 3단계: 데이터 조회 시작');
    const reviewableOrders = await reviewService.getReviewableOrders(session.user.id);
    console.log('✅ reviewableOrders 조회 완료:', reviewableOrders.length);
    
    const myReviews = await reviewService.getMyReviews(session.user.id);
    console.log('✅ myReviews 조회 완료:', myReviews.length);

    // 4. 응답 데이터 구성
    console.log('🔍 4단계: 응답 데이터 구성');
    return NextResponse.json({
      success: true,
      data: {
        reviewableOrders,
        myReviews,
        message: '데이터 조회 완료'
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
