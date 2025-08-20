import { ISearchProductListResponse } from '@/types/searchProductList';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProductService } from '@/services/search';

export const useInfiniteScroll = (initialData: ISearchProductListResponse) => {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialData.products);
  const [nextCursor, setNextCursor] = useState(initialData.pageInfo.nextCursor);
  const [hasNext, setHasNext] = useState(initialData.pageInfo.hasNext);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialData.products);
    setNextCursor(initialData.pageInfo.nextCursor);
    setHasNext(initialData.pageInfo.hasNext);
    setLoading(false);
  }, [initialData]);

  const fetchMore = async () => {
    if (loading || !hasNext || !nextCursor) return;
    setLoading(true);

    try {
      const queryString = new URLSearchParams(searchParams.toString());
      queryString.set('cursor', nextCursor);

      const data = await searchProductService.getSearchProductList(queryString.toString());

      setItems((prev) => prev.concat(data.products));
      setNextCursor(data.pageInfo.nextCursor);
      setHasNext(data.pageInfo.hasNext);
    } catch (error) {
      console.error('상품 리스트 조회 실패 : ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sentinelRef.current || !hasNext) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, nextCursor]);

  return { items, loading, sentinelRef };
};
