import { ISearchProductListResponse } from '@/types/searchProductList';
import { useState, useEffect, useRef } from 'react';

export const useInfiniteScroll = (initialData: ISearchProductListResponse) => {
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
    const queryString = new URLSearchParams(window.location.search);
    queryString.set('cursor', nextCursor);
    const res = await fetch(`/api/search?${queryString.toString()}`, { cache: 'no-store' });
    setLoading(false);
    if (!res.ok) return;
    const data: ISearchProductListResponse = await res.json();
    setItems((prev) => prev.concat(data.products));
    setNextCursor(data.pageInfo.nextCursor);
    setHasNext(data.pageInfo.hasNext);
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
