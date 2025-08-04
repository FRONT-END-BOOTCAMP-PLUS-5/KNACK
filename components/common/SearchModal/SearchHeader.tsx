'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './searchModal.module.scss';
import closeIcon from '@/public/icons/circle_close.svg';

export default function SearchHeader() {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleDeleteClick = () => {
    setSearchKeyword('');
  };

  return (
    <section className={styles.search_wrap}>
      <div className={styles.search_area}>
        <div className={styles.search}>
          <input
            className={styles.input_search}
            type="text"
            placeholder="브랜드, 상품, 프로필, 태그 등"
            title="검색창"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
          />
          {searchKeyword && (
            <button className={styles.btn_search_delete} onClick={handleDeleteClick}>
              <Image src={closeIcon} alt="close" width={24} height={24} style={{ opacity: 0.2 }} />
            </button>
          )}
        </div>
      </div>
      <button className={styles.btn_close}>취소</button>
    </section>
  );
}
