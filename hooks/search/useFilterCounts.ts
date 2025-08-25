import { useState, useEffect } from 'react';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { filterCountsService } from '@/services/filter-counts';

interface UseFilterCountsResult {
  isLoadingCount: boolean;
  error: string | null;
  buttonText: () => string;
}

export const useFilterCounts = (selectedFilter: ISearchProductListRequest): UseFilterCountsResult => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getFilterCounts } = filterCountsService;

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setIsLoadingCount(true);
        setError(null);
        const response = await getFilterCounts(selectedFilter);
        setProductCount(response.totalCount);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '상품 개수 조회 실패';
        console.error('상품 개수 조회 실패:', err);
        setError(errorMessage);
        setProductCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    if (selectedFilter) {
      fetchProductCount();
    }
  }, [selectedFilter, getFilterCounts]);

  const buttonText = () => {
    if (isLoadingCount) return '--개 상품보기';
    if (productCount !== null) return `${productCount.toLocaleString()}개 상품보기`;
    return '상품보기';
  };

  return {
    isLoadingCount,
    error,
    buttonText,
  };
};
