import { ReviewRepository } from '../../repositories/ReviewRepository';
import { OrderRepository } from '../../repositories/OrderRepository';
import { ReviewDto } from '../dtos/ReviewDto';
import { Order } from '../../domains/entities/Order';

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
        .map(order => ({
          orderId: order.id,
          productId: order.product.id,
          productName: order.product.korName,
          productEngName: order.product.engName,
          thumbnailImage: order.product.thumbnailImage || '',
          size: order.optionValue?.name || ''
        }));
    } catch (error) {
      throw new Error('리뷰 작성 가능한 주문을 조회할 수 없습니다.');
    }
  }
}
