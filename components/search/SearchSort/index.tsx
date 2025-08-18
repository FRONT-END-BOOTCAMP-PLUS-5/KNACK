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

interface IProps {
  filterQuery: ISearchProductListRequest;
}

export default function SearchSort({ filterQuery }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const isActive = (value: string) => {
    if (filterQuery.sort) {
      return value === filterQuery.sort;
    }
    return value === 'latest';
  };

  const onClickSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const sort = PRODUCT_FILTER_SORT.find((item) => item.value === filterQuery.sort);
  return (
    <section className={styles.sort_section}>
      <div className={styles.sort_left}>
        <div className={styles.sort_left_item}>
          {filterQuery?.benefit && <Image src={checkCircle} alt={'체크 아이콘'} width={16} height={16} />}
          {!filterQuery?.benefit && <span />}
          <p>정가이하</p>
        </div>
        <div className={styles.sort_left_item}>
          {filterQuery.soldOutInvisible && <Image src={checkCircle} alt={'체크 아이콘'} width={16} height={16} />}
          {!filterQuery.soldOutInvisible && <span />}
          <p>품절제외</p>
        </div>
      </div>
      <div className={styles.sort_right} onClick={() => setIsOpen(true)}>
        {sort ? <p>{sort?.name}</p> : <p>최신순</p>}

        <Image src={filterArrow} alt={'리스트 정렬 아이콘'} width={16} height={16} />
      </div>
      {isOpen && (
        <section className={styles.sort_bottom_sheet}>
          <ul>
            {PRODUCT_FILTER_SORT.map((item) => (
              <li
                key={item.id}
                className={isActive(item.value) ? styles.active : ''}
                onClick={() => onClickSort(item.value)}
              >
                <Flex justify="between">
                  <p>{item.name}</p>
                  {isActive(item.value) && <Image src={checkIcon} alt={'체크 아이콘'} width={16} height={16} />}
                </Flex>
              </li>
            ))}
          </ul>
          <div className={styles.background_black} onClick={() => setIsOpen(false)} />
        </section>
      )}
    </section>
  );
}
