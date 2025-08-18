'use client';

import styles from './recently.module.scss';
import { IRecentProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import bookmark from '@/public/icons/book_mark.svg';
import onBookMark from '@/public/icons/book_mark_active.svg';
import { ILikeList } from '@/types/like';

interface IProps {
  recentProducts: IRecentProduct[];
  likeList: ILikeList[];
  onClickSaveAdd: (productId: number) => void;
}

const RecentlySave = ({ recentProducts, likeList, onClickSaveAdd }: IProps) => {
  return (
    <section className={styles.search_product_list}>
      {recentProducts?.map((item) => {
        const bookMarkOn = likeList?.find((likeItem) => likeItem?.productId === item?.id);

        return (
          <Link key={item?.id} href={`/saved`} className={styles.product_card_large}>
            <figure className={styles.thumbnail}>
              <div className={styles.image_container}>
                <Image
                  src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item.thumbnailImage}`}
                  alt="상품이미지"
                  fill
                  className={styles.product_image}
                />
              </div>

              <button className={styles.product_bookmark} onClick={() => onClickSaveAdd(item?.id)}>
                <Image src={bookMarkOn ? onBookMark : bookmark} alt="관심" width={24} height={24} />
              </button>
            </figure>

            <figcaption className={styles.product_info}>
              <div className={styles.brand_name}>
                <p>{item.brand.engName}</p>
              </div>
              <div className={styles.product_name}>
                <p>{item.engName}</p>
              </div>
              <div className={styles.product_name_sub}>
                <p>{item.korName}</p>
              </div>

              <div className={styles.price_info}>
                <div className={styles.price}>
                  <p>{item?.price?.toLocaleString()}원</p>
                </div>
              </div>

              <div className={styles.interest_info}>
                <p>
                  관심 <span>{item?._count?.productLike}</span>
                  <span> • </span>
                  리뷰 <span>{item?._count?.reviews}</span>
                </p>
              </div>
            </figcaption>
          </Link>
        );
      })}
    </section>
  );
};

export default RecentlySave;
