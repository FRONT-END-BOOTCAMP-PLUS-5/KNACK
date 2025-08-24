import { ISearchProductListResponse } from '@/types/searchProductList';
import { useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProductService } from '@/services/search';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteScroll = (initialData: ISearchProductListResponse) => {
  const searchParams = useSearchParams();
  const { getSearchProductList } = searchProductService;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['searchProductList', searchParams.toString()],
    queryFn: async ({ pageParam }) => {
      const queryString = new URLSearchParams(searchParams.toString());
      if (pageParam) {
        queryString.set('cursor', pageParam);
      }
      return await getSearchProductList(queryString.toString());
    },
    initialPageParam: initialData.pageInfo.nextCursor || undefined,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor || undefined,
    initialData: {
      pages: [initialData],
      pageParams: [initialData.pageInfo.nextCursor || undefined],
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const items = data?.pages.flatMap((page) => page.products) || [];

  useEffect(() => {
    const sentinelElement = sentinelRef.current;
    if (!sentinelElement || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(sentinelElement);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    items,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    sentinelRef,
  };
};
