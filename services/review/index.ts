import { CreateReviewData } from '@/types/review';
import requester from '@/utils/requester';

export const reviewService = {
  // 리뷰 작성 가능한 주문 목록 조회
  getReviewOrders: async () => {
    try {
      const response = await requester.get('/api/reviews/orders');
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '데이터를 가져올 수 없습니다.');
    }
  },

  // 리뷰 생성
  createReview: async (reviewData: CreateReviewData) => {
    try {
      const response = await requester.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '리뷰 생성에 실패했습니다.');
    }
  },

  // 상품 정보 조회
  getProduct: async (productId: string) => {
    try {
      const response = await requester.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '상품 정보를 가져올 수 없습니다.');
    }
  }
};
