'use client';
import Image from 'next/image';
import styles from './searchModal.module.scss';
import { IRecentProduct } from '@/types/product';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';

interface IProps {
  recentProducts: IRecentProduct[];
  handleSearchInputClick: (state: boolean) => void;
}

export default function RecentProducts({ recentProducts, handleSearchInputClick }: IProps) {
  const router = useRouter();
  const onClickRecentProduct = (id: number) => {
    router.push(`/products/${id}`);
    handleSearchInputClick(false);
  };

  return (
    <section className={styles.search_card_items}>
      <div className={styles.layer_search_item}>
        <div className={styles.layer_search_title_wrap}>
          <h4 className={styles.title}>최근 본 상품</h4>
          <div className={styles.title_sub_text}>
            <button className={styles.color_black} type="button">
              더보기
            </button>
          </div>
        </div>
        <div className={styles.layer_search_item_content_wrap}>
          <div className={styles.recent_product_wrap}>
            <div className={styles.recent_product_list}>
              {recentProducts.map((product, index) => (
                <div
                  key={'recent-product-' + index}
                  onClick={() => onClickRecentProduct(product.id)}
                  className={styles.recent_product}
                >
                  <div>
                    <div className={styles.recent_product_img_wrap}>
                      <Image
                        src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${product.thumbnailImage}`}
                        alt={product.korName}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className={styles.recent_product_name}>{product.engName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
