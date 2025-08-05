import styles from './search_sort.module.scss';
import Image from 'next/image';
import filterArrow from '@/public/icons/filter_arrow.svg';

export default function SearchSort() {
  return (
    <section className={styles.sort_section}>
      <div className={styles.sort_left}>
        <div className={styles.sort_left_item}>
          <span />
          <p>정가이하</p>
        </div>
        <div className={styles.sort_left_item}>
          <span />
          <p>품절제외</p>
        </div>
      </div>
      <div className={styles.sort_right}>
        <p>인기순</p>
        <Image src={filterArrow} alt={'리스트 정렬 아이콘'} width={16} height={16} />
      </div>
    </section>
  );
}
