import { MyReviewDto } from '../../../../backend/reviews/applications/dtos/ReviewDto';
import { ReviewRepository, OrderRepository } from '../../repositories/reviewRepository';

export class GetMyReviewsUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<MyReviewDto[]> {
    try {
      // 1. 사용자의 모든 주문 조회
      const orders = await this.orderRepository.findOrdersByUserId(userId);
      
      // 2. 리뷰가 작성된 주문만 필터링
      const reviewedOrders: MyReviewDto[] = [];
      
      for (const order of orders) {
        // orderId 기준으로 리뷰 찾기 (더 정확한 방법)
        const review = await this.reviewRepository.findReviewByOrderId(order.id);
        
        if (review && order.product) {
          reviewedOrders.push({
            orderId: order.id,
            productId: order.product.id,
            productName: order.product.korName,
            productEngName: order.product.engName,
            thumbnailImage: order.product.thumbnailImage,
            category: order.product.category,
            size: order.optionValue?.name || '',
            review: {
              contents: review.contents,
              rating: review.rating,
              reviewImages: review.reviewImages,
              createdAt: review.createdAt
            }
          });
        }
      }
      
      return reviewedOrders;
    } catch (error) {
      throw new Error('내 리뷰를 조회할 수 없습니다.');
    }
  }
}
