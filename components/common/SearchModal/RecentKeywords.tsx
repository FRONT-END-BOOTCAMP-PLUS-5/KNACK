'use client';

import Link from 'next/link';
import Image from 'next/image';
import closeIcon from '@/public/icons/close.svg';
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
                  <Image src={closeIcon} alt="close" width={24} height={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
