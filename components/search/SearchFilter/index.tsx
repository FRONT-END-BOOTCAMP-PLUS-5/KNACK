'use client';

import React from 'react';
import DragScroll from '@/components/common/DragScroll';
import styles from './search_filter.module.scss';
import Image from 'next/image';
import arrowDown from '@/public/icons/arrow_down.svg';
import { PRODUCT_FILTER } from '@/constraint/product';

interface IProps {
  handleSelect: (id: number, isOpen: boolean) => void;
}

const SearchFilter: React.FC<IProps> = ({ handleSelect }) => {
  return (
    <div className={styles.filter_section}>
      <DragScroll className={styles.filter_scroll} showScrollbar={false}>
        {PRODUCT_FILTER.map((option) => (
          <button
            type="button"
            onClick={() => handleSelect(option.id, true)}
            key={option.id}
            className={styles.filter_button}
          >
            <p>
              <span>{option.name}</span>
              <span>1</span>
            </p>
            <Image src={arrowDown} alt={'화살표 아이콘'} width={14} height={14} />
          </button>
        ))}
      </DragScroll>
    </div>
  );
};

export default SearchFilter;
