'use client';

import Link from 'next/link';
import styles from './searchModal.module.scss';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function RecommendedTags({ handleSearchInputClick }: IProps) {
  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>추천 검색어</h4>
          <div className={styles.title_sub_text}></div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.search_card_tag_wrap}>
            {Array.from({ length: 6 }).map((tag, index) => (
              <Link
                key={index}
                href={`/search?keyword=${encodeURIComponent('태그')}`}
                className={styles.search_card_tag}
              >
                <span>{'태그'}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
