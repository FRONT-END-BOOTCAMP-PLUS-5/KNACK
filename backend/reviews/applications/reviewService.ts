import { Review, Order, ReviewableOrder } from '../domains/review';
import { ReviewRepository, OrderRepository } from '../repositories/reviewRepository';

// 리뷰 서비스 인터페이스
export interface ReviewService {
  getReviewableOrders(userId: string): Promise<ReviewableOrder[]>;
  getMyReviews(userId: string): Promise<ReviewableOrder[]>;
  createReview(userId: string, productId: number, reviewData: Omit<Review, 'userId' | 'productId' | 'createdAt'>): Promise<Review>;
}

// 리뷰 서비스 구현
export class ReviewServiceImpl implements ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private orderRepository: OrderRepository
  ) {}

  async getReviewableOrders(userId: string): Promise<ReviewableOrder[]> {
    try {
      console.log('🔍 reviewService.getReviewableOrders 시작 - userId:', userId);
      
      // 1. 사용자의 모든 주문 조회
      console.log('🔍 1단계: 주문 조회 시작');
      const orders = await this.orderRepository.findOrdersByUserId(userId);
      console.log('✅ 주문 조회 완료 - 주문 개수:', orders.length);
      
      // 2. 각 주문에 대해 리뷰 여부 확인
      console.log('🔍 2단계: 리뷰 여부 확인 시작');
      const reviewableOrders: ReviewableOrder[] = [];
      
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
          const review = await this.reviewRepository.findReviewByUserAndProduct(userId, order.productId);
          
          // Order에 포함된 Product 정보 사용
          if (order.product) {
            console.log('🔍 상품 정보:', order.product);
            
            reviewableOrders.push({
              order,
              product: order.product,
              hasReview: !!review,
              review: review || undefined
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
      console.error('❌ 오류 상세:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw new Error('리뷰 가능한 주문을 조회할 수 없습니다.');
    }
  }

  async getMyReviews(userId: string): Promise<ReviewableOrder[]> {
    try {
      // 1. 사용자의 모든 주문 조회
      const orders = await this.orderRepository.findOrdersByUserId(userId);
      
      // 2. 리뷰가 작성된 주문만 필터링
      const reviewedOrders: ReviewableOrder[] = [];
      
      for (const order of orders) {
        const review = await this.reviewRepository.findReviewByUserAndProduct(userId, order.productId);
        
        if (review && order.product) {
          reviewedOrders.push({
            order,
            product: order.product,
            hasReview: true,
            review
          });
        }
      }
      
      return reviewedOrders;
    } catch (error) {
      console.error('내 리뷰 조회 실패:', error);
      throw new Error('내 리뷰를 조회할 수 없습니다.');
    }
  }

  async createReview(userId: string, productId: number, reviewData: Omit<Review, 'userId' | 'productId' | 'createdAt'>): Promise<Review> {
    try {
      // 1. 이미 리뷰가 있는지 확인
      const existingReview = await this.reviewRepository.findReviewByUserAndProduct(userId, productId);
      if (existingReview) {
        throw new Error('이미 리뷰를 작성한 상품입니다.');
      }
      
      // 2. 리뷰 생성
      const review = await this.reviewRepository.createReview({
        userId,
        productId,
        ...reviewData
      });
      
      return review;
    } catch (error) {
      console.error('리뷰 생성 실패:', error);
      throw new Error('리뷰를 생성할 수 없습니다.');
    }
  }

  private isReviewableOrder(order: Order): boolean {
    // 테스트를 위해 결제 완료된 주문부터 리뷰 가능 (deliveryStatus >= 1)
    // 실제 운영에서는 배송 완료(deliveryStatus === 3) 또는 구매 확정(deliveryStatus === 4)일 때만
    return order.deliveryStatus >= 1;
  }


}
