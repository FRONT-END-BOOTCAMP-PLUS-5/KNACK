
import { PrReviewRepository } from '../../repositories/PrReviewRepository';
import { MyReviewDto } from '../dtos/ReviewDto';

export class GetMyReviewsUseCase {
  constructor(private reviewRepository: PrReviewRepository) {}

  async execute(userId: string): Promise<MyReviewDto[]> {
    try {
      // Review 테이블에서 시작해서 Order, Product, Option 정보를 relation으로 가져오기
      const reviews = await this.reviewRepository.findReviewsWithRelations(userId);
      
      return reviews.map(review => ({
        orderId: review.order.id,
        productId: review.product.id,
        productName: review.product.korName,
        productEngName: review.product.engName,
        thumbnailImage: review.product.thumbnailImage || '',
        size: review.order.optionValue?.name || '',
        review: {
          contents: review.contents,
          rating: review.rating,
          createdAt: review.createdAt
        }
      }));
    } catch (error) {
      throw new Error('내 리뷰를 조회할 수 없습니다.');
    }
  }
}
