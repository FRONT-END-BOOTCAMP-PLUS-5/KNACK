'use client';

import React, { useMemo } from 'react';
import DragScroll from '@/components/common/DragScroll';
import styles from './searchFilter.module.scss';
import Image from 'next/image';
import arrowDown from '@/public/icons/arrow_down.svg';
import { FILTER_TAB_KEY, PRODUCT_FILTER } from '@/constraint/product';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { calcFilterValueLength, isActiveFilter } from '@/utils/search/searchFilter';
import resetIcon from '@/public/icons/reset.svg';
import { useClearProductFilter } from '@/hooks/useClearProductFilter';

interface IProps {
  filterQuery: ISearchProductListRequest;
  handleSelect: (id: number, isOpen: boolean) => void;
}

export default function SearchFilter({ filterQuery, handleSelect }: IProps) {
  const { clearFilters } = useClearProductFilter();

  const handleReset = () => {
    clearFilters();
  };

  const isActiveResetButton = useMemo(() => {
    return FILTER_TAB_KEY.some((key) => filterQuery[key]);
  }, [filterQuery]);

  return (
    <div className={styles.filter_section}>
      <DragScroll className={styles.filter_scroll} showScrollbar={false}>
        {isActiveResetButton && (
          <button type="button" className={styles.filter_reset_button} onClick={handleReset}>
            <Image src={resetIcon} alt="초기화 아이콘" width={16} height={16} />
          </button>
        )}
        {PRODUCT_FILTER.map((option) => {
          const isActive = isActiveFilter(option.value, filterQuery);
          const count = calcFilterValueLength(option.value, filterQuery);
          return (
            <button
              type="button"
              onClick={() => handleSelect(option.id, true)}
              key={option.id}
              className={`${styles.filter_button} ${isActive ? styles.active : ''}`}
            >
              <p>
                <span>{option.name}</span>
                {count > 0 && <span className={styles.filter_count}>{count}</span>}
              </p>
              <Image src={arrowDown} alt={'화살표 아이콘'} width={14} height={14} />
            </button>
          );
        })}
      </DragScroll>
    </div>
  );
}
