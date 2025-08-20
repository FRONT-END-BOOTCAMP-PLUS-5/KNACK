import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrismaReviewRepository } from '../../../../backend/reviews/repositories/ReviewRepository';
import { PrismaOrderRepository } from '../../../../backend/reviews/repositories/OrderRepository';
import { GetReviewableOrdersUseCase } from '../../../../backend/reviews/applications/usecases/GetReviewableOrdersUseCase';
import { GetMyReviewsUseCase } from '../../../../backend/reviews/applications/usecases/GetMyReviewsUseCase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const userId = session.user.id;
    const reviewRepository = new PrismaReviewRepository();
    const orderRepository = new PrismaOrderRepository();
    
    const getReviewableOrdersUseCase = new GetReviewableOrdersUseCase(reviewRepository, orderRepository);
    const getMyReviewsUseCase = new GetMyReviewsUseCase(reviewRepository); // OrderRepository 의존성 제거
    
    const [reviewableOrders, myReviews] = await Promise.all([
      getReviewableOrdersUseCase.execute(userId),
      getMyReviewsUseCase.execute(userId)
    ]);

    return NextResponse.json({
      reviewableOrders,
      myReviews
    });
  } catch (error) {
    console.error('리뷰 데이터 조회 실패:', error);
    return NextResponse.json(
      { error: '리뷰 데이터를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}
