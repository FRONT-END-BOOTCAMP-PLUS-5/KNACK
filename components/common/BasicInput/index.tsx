import { useState } from 'react';
import styles from './basicInput.module.scss';
import Image from 'next/image';
import closeIcon from '@/public/icons/circle_close.svg';

interface IProps {
  placeholder?: string;
}

export default function BasicInput({ placeholder }: IProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleDeleteClick = () => {
    setSearchKeyword('');
  };

  return (
    <div className={styles.search_area}>
      <div className={styles.search}>
        <input
          className={styles.input_search}
          type="text"
          placeholder={placeholder}
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
  );
}
