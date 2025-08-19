import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '@/services/review';
import { ReviewOrderDto } from '@/types/review';

export const useReview = () => {
  const [reviewableOrders, setReviewableOrders] = useState<ReviewOrderDto[]>([]);
  const [myreview, setMyreview] = useState<ReviewOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviewOrders();
      
      if (data.success) {
        const reviewableOrders = data.data.reviewableOrders || [];
        const myreview = data.data.myReviews || [];
        
        // 이미 리뷰가 작성된 주문은 "리뷰 쓰기" 탭에서 제거
        const filteredReviewableOrders = reviewableOrders.filter((order: ReviewOrderDto) => {
          return !myreview.some((review: ReviewOrderDto) => review.orderId === order.orderId);
        });
        
        setReviewableOrders(filteredReviewableOrders);
        setMyreview(myreview);
      } else {
        setError(data.error || '데이터를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      setError('데이터를 가져올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeOrderFromReviewable = useCallback((orderId: number) => {
    setReviewableOrders(prev => 
      prev.filter(order => order.orderId !== orderId)
    );
  }, []);

  return {
    reviewableOrders,
    myreview,
    loading,
    error,
    fetchReviewData,
    removeOrderFromReviewable
  };
};
