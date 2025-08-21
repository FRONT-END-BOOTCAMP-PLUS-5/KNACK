'use client';

import Link from 'next/link';
import styles from './searchModal.module.scss';
import { CATEGORY_ALL_TAB } from '@/constraint/header';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function RecommendedTags({ handleSearchInputClick }: IProps) {
  const router = useRouter();
  const { addStorage } = useLocalStorage();

  const handleTagClick = (tag: string) => {
    addStorage(tag);
    router.push(`/search?keyword=${encodeURIComponent(tag)}`);
    handleSearchInputClick(false);
  };

  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>추천 검색어</h4>
          <div className={styles.title_sub_text}></div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.search_card_tag_wrap}>
            {CATEGORY_ALL_TAB.subCategories.map((tag, index) => (
              <div key={index} className={styles.search_card_tag} onClick={() => handleTagClick(tag.value)}>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
