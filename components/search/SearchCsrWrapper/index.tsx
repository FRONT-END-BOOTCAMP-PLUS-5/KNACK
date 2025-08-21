'use client';

import { useBottomSheetStore } from '@/store/bottomSheetStore';
import SearchBottomSheet from '../SearchBottomSheet';
import SearchFilter from '../SearchFilter';
import SearchSort from '../SearchSort';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { IQueryParams, queryStringToObject } from '@/utils/queryString';
import SearchCategory from '../SearchCategory';
import styles from './searchCsrWrapper.module.scss';
import { useSearchParams } from 'next/navigation';

interface IProps {
  queryParams: IQueryParams;
}

export default function SearchCsrWrapper({ queryParams }: IProps) {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get('keyword');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const [filterQuery, setFilterQuery] = useState<ISearchProductListRequest>({});
  const { onOpen } = useBottomSheetStore();

  useLayoutEffect(() => {
    const convertedQuery = queryStringToObject(queryParams);
    setFilterQuery(convertedQuery);
  }, [queryParams]);

  const handleSelect = (id: number, isOpen: boolean) => {
    setActiveTabId(id);
    if (isOpen) {
      onOpen();
    }
  };

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '-97px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {!keywordParam && <SearchCategory />}
      <div ref={sentinelRef} />
      <div className={`${styles.sticky_wrapper} ${stuck ? styles.stuck : ''}`}>
        <SearchFilter filterQuery={filterQuery} handleSelect={handleSelect} />
        <SearchSort filterQuery={filterQuery} />
      </div>
      <SearchBottomSheet activeTabId={activeTabId} handleSelect={handleSelect} filterQuery={filterQuery} />
    </>
  );
}
