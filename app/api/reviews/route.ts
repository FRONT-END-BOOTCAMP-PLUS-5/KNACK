import { NextRequest, NextResponse } from 'next/server';
import { CreateReviewUseCase } from '../../../backend/reviews/applications/usecases/CreateReviewUseCase';
import { PrismaReviewRepository } from '../../../backend/reviews/repositories/reviewRepository';

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

    // orderId 유효성 검사
    const parsedOrderId = parseInt(orderId);
    if (isNaN(parsedOrderId) || parsedOrderId <= 0) {

      return NextResponse.json(
        { success: false, error: '유효하지 않은 orderId입니다.' },
        { status: 400 }
      );
    }



    // orderId가 실제로 존재하는지 확인 (선택사항)
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const order = await prisma.order.findUnique({
        where: { id: parsedOrderId }
      });
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: `주문 ID ${parsedOrderId}가 존재하지 않습니다.` },
          { status: 400 }
        );
      }
      
      if (order.userId !== userId) {
        return NextResponse.json(
          { success: false, error: '해당 주문에 대한 권한이 없습니다.' },
          { status: 403 }
        );
      }
      
      await prisma.$disconnect();
    } catch (dbError) {
      console.error('orderId 유효성 확인 실패:', dbError);
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

    return NextResponse.json(
      { success: false, error: '리뷰 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
