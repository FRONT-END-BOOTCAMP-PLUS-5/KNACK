'use client';

import Link from 'next/link';
import styles from './searchModal.module.scss';

export default function RecentProducts() {
  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>최근 본 상품</h4>
          <div className={styles.title_sub_text}>
            <button type="button">더보기</button>
          </div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.recent_product_wrap}>
            <div className={styles.recent_product_list}>
              {Array.from({ length: 10 }).map((product, index) => (
                <Link key={'recent-product-' + index} href={`/search/${index}`} className={styles.recent_product}>
                  <div data-product-id={index}>
                    <div className={styles.recent_product_img_wrap}>
                      {/* <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover' }}
                      /> */}
                    </div>
                    <span className={styles.recent_product_name}>{'상품명'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
