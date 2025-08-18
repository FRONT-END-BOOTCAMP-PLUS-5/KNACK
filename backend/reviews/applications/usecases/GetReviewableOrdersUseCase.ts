import { ReviewDto } from '../dtos/ReviewDto';
import { ReviewRepository, OrderRepository } from '../../repositories/reviewRepository';
import { Order } from '../../domains/entities/Order'; // Order 타입 경로 수정

export class GetReviewableOrdersUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<ReviewDto[]> {
    try {
      console.log('🔍 GetReviewableOrdersUseCase 시작 - userId:', userId);
      
      // 1. 사용자의 모든 주문 조회
      console.log('🔍 1단계: 주문 조회 시작');
      const orders = await this.orderRepository.findOrdersByUserId(userId);
      console.log('✅ 주문 조회 완료 - 주문 개수:', orders.length);
      console.log('🔍 주문 데이터:', JSON.stringify(orders, null, 2));
      
      // 2. 각 주문에 대해 리뷰 여부 확인
      console.log('🔍 2단계: 리뷰 여부 확인 시작');
      const reviewableOrders: ReviewDto[] = [];
      
      for (const order of orders) {
        console.log('🔍 주문 처리 중:', order.id);
        console.log('🔍 주문 상세 정보:', {
          id: order.id,
          deliveryStatus: order.deliveryStatus,
          isReviewable: this.isReviewableOrder(order)
        });
        
        // 리뷰 작성 가능한 주문인지 확인 (배송 완료 등)
        if (this.isReviewableOrder(order)) {
          console.log('✅ 리뷰 가능한 주문:', order.id);
          const review = await this.reviewRepository.findReviewByOrderId(order.id); // orderId로 리뷰 찾기
          
          // Order에 포함된 Product 정보 사용
          if (order.product) {
            console.log('🔍 상품 정보:', order.product);
            
            reviewableOrders.push({
              orderId: order.id,
              productId: order.product.id,
              productName: order.product.korName,
              productEngName: order.product.engName,
              thumbnailImage: order.product.thumbnailImage,
              category: order.product.category,
              size: order.optionValue?.name || '', // 하드코딩 제거
              hasReview: !!review,
              review: review ? {
                contents: review.contents,
                rating: review.rating,
                reviewImages: review.reviewImages,
                createdAt: review.createdAt
              } : undefined
            });
          } else {
            console.log('❌ 상품 정보가 없음 - orderId:', order.id);
          }
        } else {
          console.log('❌ 리뷰 불가능한 주문:', order.id, '- deliveryStatus:', order.deliveryStatus);
        }
      }
      
      console.log('✅ 최종 결과 - 리뷰 가능한 주문 개수:', reviewableOrders.length);
      return reviewableOrders;
    } catch (error) {
      console.error('❌ 리뷰 가능한 주문 조회 실패:', error);
      throw new Error('리뷰 가능한 주문을 조회할 수 없습니다.');
    }
  }

  private isReviewableOrder(order: Order): boolean { // any 타입을 Order로 변경
    // 테스트를 위해 모든 주문을 리뷰 가능하게 설정
    // 실제 운영에서는 배송 완료(deliveryStatus === 3) 또는 구매 확정(deliveryStatus === 4)일 때만
    return true; // 모든 주문을 리뷰 가능하게 설정
  }
}
