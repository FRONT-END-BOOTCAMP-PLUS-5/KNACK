import Link from 'next/link';
import styles from './searchModal.module.scss';

export default function PopularKeywords() {
  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>인기 검색어</h4>
          <div className={styles.title_sub_text}>
            <span>{'08.01 16:00 기준'}</span>
          </div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.search_card}>
            <ol className={styles.search_card_ranking}>
              {Array.from({ length: 20 }).map((item, index) => (
                <li key={'popular-keyword-' + index} className={styles.search_card_ranking_item}>
                  <span className={styles.ranking_idx}>{index + 1}</span>
                  <Link href={`/search?keyword=${encodeURIComponent('키워드')}`} className={styles.ranking_title}>
                    <span>{'키워드'}</span>
                  </Link>
                  {/* {item.description && <span className={styles.ranking_description}>{item.description}</span>} */}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
