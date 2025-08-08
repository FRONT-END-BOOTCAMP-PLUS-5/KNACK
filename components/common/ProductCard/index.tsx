import Image from 'next/image';
import Link from 'next/link';
import styles from './product_card.module.scss';
import bookmark from '@/public/icons/book_mark.svg';
import { ProductDto } from '@/backend/search/applications/dtos/GetProductsDto';
import { STORAGE_PATHS } from '@/constraint/auth';

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

const ProductCardLarge = ({ product }: { product: ProductDto }) => {
  return (
    <Link href={`/products/${'product.id'}`} className={styles.product_card_large}>
      <figure className={styles.thumbnail}>
        <div className={styles.image_container}>
          <Image
            src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${product.thumbnailImage}`}
            alt={'상품이미지'}
            fill
            className={styles.product_image}
          />
        </div>
        <div className={styles.product_bookmark}>
          <Image src={bookmark} alt={'관심'} width={24} height={24} />
        </div>
      </figure>

      <figcaption className={styles.product_info}>
        <div className={styles.brand_name}>
          <p>{product.brand.engName}</p>
        </div>
        <div className={styles.product_name}>
          <p>{product.engName}</p>
        </div>
        <div className={styles.product_name_sub}>
          <p>{product.korName}</p>
        </div>

        <div className={styles.price_info}>
          <div className={styles.price}>
            <p>{product.price.toLocaleString()}원</p>
          </div>
        </div>

        <div className={styles.interest_info}>
          <p>
            관심 <span>{product.likesCount}</span>
            <span>•</span>
            리뷰 <span>{product.reviewsCount}</span>
          </p>
        </div>
      </figcaption>
    </Link>
  );
};

export { ProductCardSmall, ProductCardLarge };
