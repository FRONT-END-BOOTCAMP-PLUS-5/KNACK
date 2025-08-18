import { useEffect, useState } from 'react';
import styles from './basicInput.module.scss';
import Image from 'next/image';
import closeIcon from '@/public/icons/circle_close.svg';
import useDebounce from '@/hooks/useDebounce';

interface IProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function BasicInput({ placeholder, onChange }: IProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const debouncedSearchKeyword = useDebounce(searchKeyword);

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    if (onChange) {
      onChange(debouncedSearchKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchKeyword]);

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
