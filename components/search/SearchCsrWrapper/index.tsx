'use client';

import { useBottomSheetStore } from '@/store/bottomSheetStore';
import SearchBottomSheet from '../SearchBottomSheet';
import SearchFilter from '../SearchFilter';
import SearchSort from '../SearchSort';
import { useLayoutEffect, useState } from 'react';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { IQueryParams, queryStringToObject } from '@/utils/queryString';
import SearchCategory from '../SearchCategory';

interface IProps {
  queryParams: IQueryParams;
}

export default function SearchCsrWrapper({ queryParams }: IProps) {
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

  return (
    <>
      <SearchCategory />
      <SearchFilter filterQuery={filterQuery} handleSelect={handleSelect} />
      <SearchSort filterQuery={filterQuery} />
      <SearchBottomSheet activeTabId={activeTabId} handleSelect={handleSelect} filterQuery={filterQuery} />
    </>
  );
}
