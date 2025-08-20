import { ReviewRepository } from '@/backend/reviews/repositories/ReviewRepository';
import { OrderRepository } from '@/backend/reviews/repositories/OrderRepository';
import { ReviewDto } from '@/backend/reviews/applications/dtos/ReviewDto';
import { Order } from '@/backend/reviews/domains/entities/Order';

export class GetReviewableOrdersUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<ReviewDto[]> {
    try {
      // 한 번의 쿼리로 모든 데이터 획득 (Review 존재 여부 포함)
      const orders: Order[] = await this.orderRepository.findOrdersWithReviewStatus(userId);
      
      // 메모리에서 필터링 (데이터베이스 쿼리 없음)
      return orders
        .filter(order => !order.review && order.product) // 리뷰가 없는 주문만
        .map(order => {
          // filter에서 이미 product가 존재함을 확인했으므로 타입 단언 사용
          const product = order.product!;
          return {
            orderId: order.id,
            productId: product.id,
            productName: product.korName,
            productEngName: product.engName,
            thumbnailImage: product.thumbnailImage || '',
            size: order.optionValue?.name || ''
          };
        });
    } catch (error) {
      throw new Error('리뷰 작성 가능한 주문을 조회할 수 없습니다.');
    }
  }
}
