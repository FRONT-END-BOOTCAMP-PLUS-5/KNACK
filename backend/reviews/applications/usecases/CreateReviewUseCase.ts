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
      
      // 1. 이미 리뷰가 있는지 확인 (orderId 기준만)
      const existingReviewByOrder = await this.reviewRepository.findReviewByOrderId(orderId);
      if (existingReviewByOrder) {
        console.log('❌ 중복 리뷰 발견 - 동일 주문:', existingReviewByOrder);
        throw new Error('이미 해당 주문에 대한 리뷰를 작성했습니다.');
      }
      
      console.log('✅ 중복 체크 통과, 리뷰 생성 시작');
      
      // 2. 리뷰 생성
      const review = await this.reviewRepository.createReview({
        userId,
        productId,
        ...reviewData
      });
      
      console.log('✅ 리뷰 생성 성공:', review);
      return review;
    } catch (error) {
      console.error('❌ 리뷰 생성 실패:', error);
      throw error;
    }
  }
}
