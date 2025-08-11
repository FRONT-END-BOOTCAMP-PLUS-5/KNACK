import BasicInput from '@/components/common/BasicInput';
import styles from './searchBottomSheet.module.scss';
import Image from 'next/image';
import check from '@/public/icons/check.svg';

export default function SearchBrand() {
  return (
    <div className={styles.search_brand}>
      <div className={styles.search_brand_input_wrap}>
        <BasicInput placeholder="브랜드를 검색하세요" />
      </div>
      <div className={styles.search_brand_list_wrap}>
        <div className={styles.search_brand_list_header}>&</div>
        <ul className={styles.search_brand_list}>
          <li className={styles.search_brand_list_item}>
            <span>브랜드 1</span>
            <Image src={check} alt="check" width={14} height={1} />
          </li>
        </ul>
      </div>
    </div>
  );
}
