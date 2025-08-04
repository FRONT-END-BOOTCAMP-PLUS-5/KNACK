'use client';

import Link from 'next/link';
import styles from './searchModal.module.scss';

export default function RecentKeywords() {
  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>최근 검색어</h4>
          <div className={styles.title_sub_text}>
            <button type="button">지우기</button>
          </div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.recent_box}>
            <div className={styles.search_list}>
              {Array.from({ length: 3 }).map((keyword, index) => (
                <Link
                  key={index}
                  href={`/search?keyword=${encodeURIComponent('키워드')}`}
                  className={styles.search_item}
                >
                  <div className={styles.search_item_text}>{'키워드'}</div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24}>
                    <path
                      fill="#BBB"
                      fillRule="evenodd"
                      d="m10.94 12-3.47 3.47 1.06 1.06L12 13.06l3.47 3.47 1.06-1.06L13.06 12l3.47-3.47-1.06-1.06L12 10.94 8.53 7.47 7.47 8.53 10.94 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
