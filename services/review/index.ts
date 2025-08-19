import { CreateReviewData } from '@/types/review';
import requester from '@/utils/requester';

export const reviewService = {
  // 리뷰 작성 가능한 주문 목록 조회
  getReviewOrders: async () => {
    const { data, error } = await requester.get('/api/reviews/orders');
    if (error) throw new Error(error.message);
    return data;
  },

  // 리뷰 생성
  createReview: async (reviewData: CreateReviewData) => {
    const { data, error } = await requester.post('/api/reviews', reviewData);
    if (error) throw new Error(error.message);
    return data;
  },

  // 상품 정보 조회
  getProduct: async (productId: string) => {
    const { data, error } = await requester.get(`/api/products/${productId}`);
    if (error) throw new Error(error.message);
    return data;
  }
};
