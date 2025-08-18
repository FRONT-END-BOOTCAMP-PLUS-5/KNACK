import { MyReviewDto } from '../../../../backend/reviews/applications/dtos/ReviewDto';
import { ReviewRepository, OrderRepository } from '../../repositories/reviewRepository';

export class GetMyReviewsUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<MyReviewDto[]> {
    try {
      console.log('🔍 GetMyReviewsUseCase 시작 - userId:', userId);
      
      // 1. 사용자의 모든 주문 조회
      const orders = await this.orderRepository.findOrdersByUserId(userId);
      console.log('🔍 전체 주문 개수:', orders.length);
      
      // 2. 리뷰가 작성된 주문만 필터링
      const reviewedOrders: MyReviewDto[] = [];
      
      for (const order of orders) {
        console.log('🔍 주문 처리 중:', { orderId: order.id, productId: order.productId });
        
        // orderId 기준으로 리뷰 찾기 (더 정확한 방법)
        const review = await this.reviewRepository.findReviewByOrderId(order.id);
        
        if (review && order.product) {
          console.log('✅ 리뷰 발견:', { orderId: order.id, productId: order.productId, review });
          reviewedOrders.push({
            orderId: order.id,
            productId: order.product.id,
            productName: order.product.korName,
            productEngName: order.product.engName,
            thumbnailImage: order.product.thumbnailImage,
            category: order.product.category,
            size: order.optionValue?.name || '', // order.optionValue.name 사용, 하드코딩 제거
            review: {
              contents: review.contents,
              rating: review.rating,
              reviewImages: review.reviewImages,
              createdAt: review.createdAt
            }
          });
        } else {
          console.log('❌ 리뷰 없음:', { orderId: order.id, productId: order.productId });
        }
      }
      
      console.log('✅ 최종 결과 - 리뷰가 있는 주문 개수:', reviewedOrders.length);
      console.log('🔍 리뷰가 있는 주문들:', reviewedOrders.map(o => ({ orderId: o.orderId, productId: o.productId })));
      
      return reviewedOrders;
    } catch (error) {
      console.error('내 리뷰 조회 실패:', error);
      throw new Error('내 리뷰를 조회할 수 없습니다.');
    }
  }
}
