import Image from 'next/image';
import Link from 'next/link';
import styles from './product_card.module.scss';
import bookmark from '@/public/icons/book_mark.svg';

const ProductCardSmall = () => {
  return (
    <Link href={`/products/${1}`} className={styles.product_card_small}>
      <figure className={styles.thumbnail}>
        <div className={styles.image_container}>
          <Image
            src={'/images/test_usagi.webp'}
            alt={'상품이미지'}
            width={110}
            height={110}
            className={styles.product_image}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </figure>

      <figcaption className={styles.product_info}>
        <div className={styles.product_name}>
          <p>{'name'}</p>
        </div>

        <div className={styles.price_info}>
          <div className={styles.price}>
            <p>{'10,000'}원</p>
          </div>
        </div>

        <div className={styles.interest_info}>
          <p>
            관심 <span>{'10'}</span>
          </p>
        </div>
      </figcaption>
    </Link>
  );
};

const ProductCardLarge = () => {
  return (
    <Link href={`/products/${1}`} className={styles.product_card_large}>
      <figure className={styles.thumbnail}>
        <div className={styles.image_container}>
          <Image src={'/images/test_usagi.webp'} alt={'상품이미지'} fill className={styles.product_image} />
        </div>
        <div className={styles.product_bookmark}>
          <Image src={bookmark} alt={'관심'} width={24} height={24} />
        </div>
      </figure>

      <figcaption className={styles.product_info}>
        <div className={styles.brand_name}>
          <p>{'brand'}</p>
        </div>
        <div className={styles.product_name}>
          <p>{'name'}</p>
        </div>
        <div className={styles.product_name_sub}>
          <p>{'korName'}</p>
        </div>

        <div className={styles.price_info}>
          <div className={styles.price}>
            <p>{'10,000'}원</p>
          </div>
        </div>

        <div className={styles.interest_info}>
          <p>
            관심 <span>{'10'}</span>
            <span>•</span>
            리뷰 <span>{'3'}</span>
          </p>
        </div>
      </figcaption>
    </Link>
  );
};

export { ProductCardSmall, ProductCardLarge };
