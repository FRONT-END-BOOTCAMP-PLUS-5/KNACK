import { Review } from '../../domains/entities/Review';
import { ReviewRepository } from '../../repositories/reviewRepository';

export class CreateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(
    userId: string, 
    productId: number, 
    orderId: number,
    reviewData: Omit<Review, 'userId' | 'productId' | 'createdAt'>
  ): Promise<Review> {
    try {
      console.log('🔍 리뷰 생성 시작:', { userId, productId, orderId, rating: reviewData.rating });
      
      // 1. 이미 리뷰가 있는지 확인 (orderId 기준으로 변경)
      const existingReview = await this.reviewRepository.findReviewByOrderId(orderId);
      if (existingReview) {
        console.log('❌ 중복 리뷰 발견:', existingReview);
        throw new Error('이미 해당 주문에 대한 리뷰를 작성했습니다.');
      }
      
      console.log('✅ 중복 체크 통과, 리뷰 생성 시작');
      
      // 2. 리뷰 생성 (원래 productId 사용, orderId는 별도 필드)
      const review = await this.reviewRepository.createReview({
        userId,
        productId, // 원래 productId 사용 (Foreign Key 제약조건 만족)
        ...reviewData
      });
      
      console.log('✅ 리뷰 생성 성공:', review);
      return review;
    } catch (error) {
      console.error('❌ 리뷰 생성 실패:', error);
      throw error; // 원본 에러를 그대로 전달
    }
  }
}
