import styles from './headerInput.module.scss';
import { useSearchParams } from 'next/navigation';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function HeaderInput({ handleSearchInputClick }: IProps) {
  const keyword = useSearchParams().get('keyword');

  return (
    <div className={styles.search_area}>
      <div className={styles.search} onClick={() => handleSearchInputClick(true)}>
        <input
          readOnly
          className={styles.input_search}
          type="text"
          placeholder="브랜드, 상품, 태그 등"
          title="검색창"
          value={keyword || ''}
        />
      </div>
    </div>
  );
}
