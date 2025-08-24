import { useState, useEffect } from 'react';
import { reviewService } from '@/services/review';

export const useReviewCount = () => {
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewCount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await reviewService.getReviewCount();
      
      if (data.success) {
        setReviewCount(data.reviewCount);
      } else {
        setError(data.error || '리뷰 개수를 가져올 수 없습니다.');
        setReviewCount(0);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '리뷰 개수 조회 실패';
      console.error('리뷰 개수 조회 실패:', error);
      setError(errorMessage);
      setReviewCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewCount();
  }, []);

  return {
    reviewCount,
    isLoading,
    error,
    refetch: fetchReviewCount
  };
};
