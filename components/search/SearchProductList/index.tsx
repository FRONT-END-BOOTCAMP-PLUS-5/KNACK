'use client';
import styles from './searchProductList.module.scss';
import { ProductCardLarge } from '@/components/common/ProductCard';
import SearchProductListEmpty from './SearchProductListEmpty';
import { useInfiniteScroll } from '@/hooks/search/useInfiniteScroll';
import Image from 'next/image';
import loadingIcon from '@/public/images/loading.gif';
import Flex from '@/components/common/Flex';
import { ISearchProductListResponse } from '@/types/searchProductList';
interface IProps {
  initialData: ISearchProductListResponse;
}

export default function SearchProductList({ initialData }: IProps) {
  const { items, loading, sentinelRef } = useInfiniteScroll(initialData);
  return (
    <>
      {initialData.products.length > 0 && (
        <div className={styles.search_product_list}>
          {items.map((product, index) => (
            <ProductCardLarge key={index} product={product} />
          ))}
        </div>
      )}
      {!initialData || (initialData.products.length === 0 && <SearchProductListEmpty />)}
      <div ref={sentinelRef} />
      {loading && (
        <Flex justify="center" align="center" style={{ paddingBottom: '80px' }}>
          <Image src={loadingIcon} alt="loading" width={100} height={100} />
        </Flex>
      )}
    </>
  );
}
