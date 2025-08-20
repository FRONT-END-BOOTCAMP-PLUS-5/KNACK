import { NextRequest, NextResponse } from 'next/server';
import { CreateReviewUseCase } from '../../../backend/reviews/applications/usecases/CreateReviewUseCase';
import { PrismaReviewRepository } from '../../../backend/reviews/repositories/ReviewRepository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, orderId, contents, rating, reviewImages } = body;

                    // 필수 필드 검증
                if (!userId || !productId || !contents || !rating || !orderId) {
                  return NextResponse.json(
                    { success: false, error: '필수 필드가 누락되었습니다. (userId, productId, orderId, contents, rating)' },
                    { status: 400 }
                  );
                }

    // orderId 파싱 및 기본 유효성 검사
    const parsedOrderId = parseInt(orderId);
    if (isNaN(parsedOrderId) || parsedOrderId <= 0) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 orderId입니다.' },
        { status: 400 }
      );
    }

    // 백엔드 로직 사용
    const reviewRepository = new PrismaReviewRepository();
    const createReviewUseCase = new CreateReviewUseCase(reviewRepository);

    

    const review = await createReviewUseCase.execute(
      userId,
      parseInt(productId),
      parsedOrderId,
      {
        orderId: parsedOrderId,
        contents,
        rating: parseInt(rating),
        reviewImages: reviewImages || '',
      }
    );

    return NextResponse.json({
      success: true,
      data: review,
      message: '리뷰가 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    console.error('리뷰 생성 실패:', error);
    
    // 백엔드 에러 처리
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // 예상치 못한 에러
    return NextResponse.json(
      { success: false, error: '리뷰 생성에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
