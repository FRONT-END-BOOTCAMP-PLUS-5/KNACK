import { ReviewDto } from '../dtos/ReviewDto';
import { ReviewRepository, OrderRepository } from '../../repositories/reviewRepository';
import { Order } from '../../domains/entities/Order';

export class GetReviewableOrdersUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<ReviewDto[]> {
    try {
      // 1. 사용자의 모든 주문 조회
      const orders = await this.orderRepository.findOrdersByUserId(userId);

      // 2. 각 주문에 대해 리뷰 여부 확인
      const reviewableOrders: ReviewDto[] = [];

      for (const order of orders) {
        if (this.isReviewableOrder(order)) {
          // orderId 기준으로만 리뷰 존재 여부 확인
          const review = await this.reviewRepository.findReviewByOrderId(order.id);
          const hasReview = !!review;

          if (order.product) {
            reviewableOrders.push({
              orderId: order.id,
              productId: order.product.id,
              productName: order.product.korName,
              productEngName: order.product.engName,
              thumbnailImage: order.product.thumbnailImage,
              category: order.product.category,
              size: order.optionValue?.name || '',
              hasReview,
              review: review ? {
                contents: review.contents,
                rating: review.rating,
                reviewImages: review.reviewImages,
                createdAt: review.createdAt
              } : undefined
            });
          }
        }
      }

      return reviewableOrders;
    } catch (error) {
      throw new Error('리뷰 가능한 주문을 조회할 수 없습니다.');
    }
  }

  private isReviewableOrder(order: Order): boolean {
    return true;
  }
}
