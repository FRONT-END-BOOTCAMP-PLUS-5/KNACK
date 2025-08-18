'use client';

import { useBottomSheetStore } from '@/store/bottomSheetStore';
import SearchBottomSheet from '../SearchBottomSheet';
import SearchFilter from '../SearchFilter';
import SearchSort from '../SearchSort';
import { useLayoutEffect, useState } from 'react';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { IQueryParams } from '@/app/(user)/search/page';

interface IProps {
  queryParams: IQueryParams;
}

export default function SearchCsrWrapper({ queryParams }: IProps) {
  const [activeTabId, setActiveTabId] = useState(0);
  const [filterQuery, setFilterQuery] = useState<ISearchProductListRequest>({});
  const { onOpen } = useBottomSheetStore();

  useLayoutEffect(() => {
    const convertedQuery: ISearchProductListRequest = {};
    if (queryParams.keyword) convertedQuery.keyword = queryParams.keyword;
    if (queryParams.gender) convertedQuery.gender = queryParams.gender;
    if (queryParams.benefit) convertedQuery.benefit = queryParams.benefit;
    if (queryParams.sort) {
      const sortValue = queryParams.sort;
      if (['latest', 'popular', 'price_high', 'price_low', 'likes', 'reviews'].includes(sortValue)) {
        convertedQuery.sort = sortValue;
      }
    }
    if (queryParams.cursor) convertedQuery.cursor = queryParams.cursor;
    if (queryParams.soldOutInvisible) convertedQuery.soldOutInvisible = queryParams.soldOutInvisible === 'true';
    if (queryParams.price) convertedQuery.price = queryParams.price;
    if (queryParams.discount) convertedQuery.discount = queryParams.discount;

    if (queryParams.keywordColorId) {
      convertedQuery.keywordColorId = queryParams.keywordColorId.split(',').map((id) => parseInt(id));
    }
    if (queryParams.brandId) {
      convertedQuery.brandId = queryParams.brandId.split(',').map((id) => parseInt(id));
    }
    if (queryParams.categoryId) {
      convertedQuery.categoryId = queryParams.categoryId.split(',').map((id) => parseInt(id));
    }
    if (queryParams.subCategoryId) {
      convertedQuery.subCategoryId = queryParams.subCategoryId.split(',').map((id) => parseInt(id));
    }
    if (queryParams.size) convertedQuery.size = queryParams.size.split(',').map((size) => size.trim());

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
      <SearchFilter filterQuery={filterQuery} handleSelect={handleSelect} />
      <SearchSort filterQuery={filterQuery} />
      <SearchBottomSheet activeTabId={activeTabId} handleSelect={handleSelect} filterQuery={filterQuery} />
    </>
  );
}
