import { ReviewRepository } from '../../repositories/ReviewRepository';
import { Review } from '@/backend/reviews/domains/entities/Review';

export class CreateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(
    userId: string, 
    productId: number, 
    orderId: number,
    reviewData: Omit<Review, 'id' | 'userId' | 'productId' | 'createdAt'>
  ): Promise<Review> {
    try {
      // 1. 이미 해당 주문에 대한 리뷰가 있는지 확인 (orderId 기준)
      // 같은 상품을 여러 번 주문한 경우, 각 주문마다 리뷰를 작성할 수 있어야 함
      const existingReview = await this.reviewRepository.findReviewByOrderId(orderId);
      if (existingReview) {
        throw new Error('이미 해당 주문에 대한 리뷰를 작성했습니다.');
      }

      // 2. 리뷰 생성
      const review = await this.reviewRepository.createReview({
        userId,
        productId,
        orderId,
        contents: reviewData.contents,
        rating: reviewData.rating,
        reviewImages: reviewData.reviewImages,
        createdAt: new Date()
      });

      return review;
    } catch (error) {
      throw error;
    }
  }
}
