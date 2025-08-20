import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '@/services/review';
import { ReviewOrderDto, MyReviewDto } from '@/types/review';

export const useReview = () => {
  const [reviewableOrders, setReviewableOrders] = useState<ReviewOrderDto[]>([]);
  const [myreview, setMyreview] = useState<MyReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviewOrders();
      
      // 백엔드에서 이미 분리된 데이터를 그대로 사용
      const reviewableOrders = data.reviewableOrders || [];
      const myreview = data.myReviews || [];
      
      setReviewableOrders(reviewableOrders);
      setMyreview(myreview);
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
