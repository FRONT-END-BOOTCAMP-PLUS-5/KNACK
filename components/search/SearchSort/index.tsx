import styles from './searchSort.module.scss';
import Image from 'next/image';
import filterArrow from '@/public/icons/filter_arrow.svg';
import checkCircle from '@/public/icons/check_circle.svg';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { PRODUCT_FILTER_SORT } from '@/constraint/product';

interface IProps {
  filterQuery: ISearchProductListRequest;
}

export default function SearchSort({ filterQuery }: IProps) {
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
      <div className={styles.sort_right}>
        {sort ? <p>{sort?.name}</p> : <p>최신순</p>}

        <Image src={filterArrow} alt={'리스트 정렬 아이콘'} width={16} height={16} />
      </div>
    </section>
  );
}
