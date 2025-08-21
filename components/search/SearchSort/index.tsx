'use client';
import styles from './searchSort.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { PRODUCT_FILTER_SORT } from '@/constraint/product';
import Flex from '@/components/common/Flex';
import filterArrow from '@/public/icons/filter_arrow.svg';
import checkCircle from '@/public/icons/check_circle.svg';
import checkIcon from '@/public/icons/check.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import Portal from '@/components/common/Portal';

interface IProps {
  filterQuery: ISearchProductListRequest;
}

export default function SearchSort({ filterQuery }: IProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isSortModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSortModalOpen]);

  const isSortActive = (value: string) => {
    if (filterQuery.sort) {
      return value === filterQuery.sort;
    }
    return value === 'latest';
  };

  const onClickSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/search?${params.toString()}`);
    setIsSortModalOpen(false);
  };

  const currentSortValue = PRODUCT_FILTER_SORT.find((item) => item.value === filterQuery.sort);

  const onClickBenefitSoldOut = (type: 'benefit' | 'soldOutInvisible') => {
    const params = new URLSearchParams(searchParams.toString());
    const isSoldOutInvisible = params.get(type);
    if (isSoldOutInvisible === 'true') {
      params.delete(type);
    } else {
      params.set(type, 'true');
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className={styles.sort_section}>
      <div className={styles.sort_left}>
        <div className={styles.sort_left_item} onClick={() => onClickBenefitSoldOut('benefit')}>
          {filterQuery?.benefit && <Image src={checkCircle} alt={'체크 아이콘'} width={16} height={16} />}
          {!filterQuery?.benefit && <span />}
          <p>정가이하</p>
        </div>
        <div className={styles.sort_left_item} onClick={() => onClickBenefitSoldOut('soldOutInvisible')}>
          {filterQuery.soldOutInvisible && <Image src={checkCircle} alt={'체크 아이콘'} width={16} height={16} />}
          {!filterQuery.soldOutInvisible && <span />}
          <p>품절제외</p>
        </div>
      </div>
      <div className={styles.sort_right} onClick={() => setIsSortModalOpen(true)}>
        {currentSortValue ? <p>{currentSortValue?.name}</p> : <p>최신순</p>}

        <Image src={filterArrow} alt={'리스트 정렬 아이콘'} width={16} height={16} />
      </div>
      {isSortModalOpen && (
        <Portal>
          <section className={styles.sort_bottom_sheet}>
            <ul>
              {PRODUCT_FILTER_SORT.map((item) => (
                <li
                  key={item.id}
                  className={isSortActive(item.value) ? styles.active : ''}
                  onClick={() => onClickSort(item.value)}
                >
                  <Flex justify="between">
                    <p>{item.name}</p>
                    {isSortActive(item.value) && <Image src={checkIcon} alt={'체크 아이콘'} width={16} height={16} />}
                  </Flex>
                </li>
              ))}
            </ul>
            <div className={styles.background_black} onClick={() => setIsSortModalOpen(false)} />
          </section>
        </Portal>
      )}
    </section>
  );
}
