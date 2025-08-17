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
        // orderId 기준으로 리뷰 찾기 (현재 DB 스키마에는 orderId가 없으므로 임시로 userId + productId 사용)
        const review = await this.reviewRepository.findReviewByUserAndProduct(userId, order.productId);
        
        if (review && order.product) {
          console.log('🔍 리뷰 발견:', { orderId: order.id, productId: order.productId, review });
          reviewedOrders.push({
            orderId: order.id,
            productId: order.product.id,
            productName: order.product.korName,
            productEngName: order.product.engName,
            thumbnailImage: order.product.thumbnailImage,
            category: order.product.category,
            size: order.product.size || '사이즈 정보 없음',
            review: {
              contents: review.contents,
              rating: review.rating,
              reviewImages: review.reviewImages,
              createdAt: review.createdAt
            }
          });
        } else {
          console.log('🔍 리뷰 없음:', { orderId: order.id, productId: order.productId });
        }
      }
      
      return reviewedOrders;
    } catch (error) {
      console.error('내 리뷰 조회 실패:', error);
      throw new Error('내 리뷰를 조회할 수 없습니다.');
    }
  }
}
