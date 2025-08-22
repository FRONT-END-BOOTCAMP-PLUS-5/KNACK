'use client';

import styles from './searchModal.module.scss';
import BasicInput from '../BasicInput';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function SearchHeader({ handleSearchInputClick }: IProps) {
  const router = useRouter();
  const { addStorage } = useLocalStorage();

  const onKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>, keyword: string) => {
    if (event.key === 'Enter') {
      addStorage(keyword);
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
      handleSearchInputClick(false);
    }
  };

  return (
    <section className={styles.search_wrap}>
      <BasicInput placeholder="브랜드, 상품, 프로필, 태그 등" onKeyDown={onKeyDownSearch} />
      <button className={styles.btn_close} onClick={() => handleSearchInputClick(false)}>
        취소
      </button>
    </section>
  );
}
