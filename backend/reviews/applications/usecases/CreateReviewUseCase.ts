import { ReviewRepository } from '../../repositories/reviewRepository';
import { Review } from '../../domains/entities/Review';

export class CreateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(
    userId: string, 
    productId: number, 
    orderId: number,
    reviewData: Omit<Review, 'userId' | 'productId' | 'createdAt'>
  ): Promise<Review> {
    try {
      // 1. 이미 리뷰가 있는지 확인 (orderId 기준만)
      const existingReviewByOrder = await this.reviewRepository.findReviewByOrderId(orderId);
      if (existingReviewByOrder) {
        throw new Error('이미 해당 주문에 대한 리뷰를 작성했습니다.');
      }

      // 2. 리뷰 생성
      const review = await this.reviewRepository.createReview({
        userId,
        productId,
        ...reviewData
      });

      return review;
    } catch (error) {
      throw error;
    }
  }
}
