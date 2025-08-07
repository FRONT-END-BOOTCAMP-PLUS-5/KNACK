import Image from 'next/image';
import styles from './productTopImage.module.scss';
import { STORAGE_PATHS } from '@/constraint/auth';

const SLIDER_IMAGE = [
  'levis_nike_trucker_jacket_lightblue-slide1.webp',
  'levis_nike_trucker_jacket_lightblue-slide2.webp',
];

const ProductTopImage = () => {
  return (
    <article>
      <div className={styles.image_box}>
        <Image
          src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/levis_nike_trucker_jacket_lightblue-thumbnail.webp`}
          fill
          alt="상품 대표 이미지"
        />
      </div>
      <article className={styles.slide_iamge_wrap}>
        {SLIDER_IMAGE?.map((item) => (
          <span className={styles.slide_image_box} key={item}>
            <Image src={`${STORAGE_PATHS.PRODUCT.SLIDER}/${item}`} width={56} height={56} alt="상품 슬라이드 이미지1" />
          </span>
        ))}
      </article>
    </article>
  );
};

export default ProductTopImage;
