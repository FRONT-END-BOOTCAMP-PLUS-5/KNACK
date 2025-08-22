'use client';

import styles from './searchModal.module.scss';
import SearchHeader from './SearchHeader';
import RecentKeywords from './RecentKeywords';
import RecommendedTags from './RecommendedTags';
import RecentProducts from './RecentProducts';
import { productsService } from '@/services/products';
import { useCallback, useEffect, useState } from 'react';
import { IRecentProduct } from '@/types/product';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function SearchModal({ handleSearchInputClick }: IProps) {
  const { getRecentlyProductList } = productsService;
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);

  const handleGetRecentlyProduct = useCallback(
    (ids: string[]) => {
      const params = new URLSearchParams();

      if (!ids) return;

      ids.forEach((id) => params.append('id', id));

      getRecentlyProductList(params.toString())
        .then((res) => {
          if (res.status === 200) {
            setRecentProducts(res.result);
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [getRecentlyProductList]
  );

  useEffect(() => {
    const storage = localStorage.getItem('recent') && JSON.parse(localStorage.getItem('recent') ?? '');

    handleGetRecentlyProduct(storage);
  }, [handleGetRecentlyProduct]);

  return (
    <article className={styles.search_container}>
      <SearchHeader handleSearchInputClick={handleSearchInputClick} />

      <section className={styles.search_content_wrap}>
        <RecentKeywords handleSearchInputClick={handleSearchInputClick} />
        <RecommendedTags handleSearchInputClick={handleSearchInputClick} />
        {/* <PopularKeywords /> */}
        <RecentProducts recentProducts={recentProducts} handleSearchInputClick={handleSearchInputClick} />
      </section>
    </article>
  );
}
