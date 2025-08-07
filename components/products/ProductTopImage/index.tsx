import Image from 'next/image';
import styles from './productTopImage.module.scss';
import { STORAGE_PATHS } from '@/constraint/auth';

interface IProps {
  thumbnailImage: string;
  sliderImage: string;
}

const ProductTopImage = ({ thumbnailImage, sliderImage }: IProps) => {
  const sliderImages = sliderImage.split(',');

  return (
    <article>
      <div className={styles.image_box}>
        <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${thumbnailImage}`} fill alt="상품 대표 이미지" />
      </div>
      <article className={styles.slide_image_wrap}>
        {sliderImages?.map((item) => (
          <span className={styles.slide_image_box} key={item}>
            <Image src={`${STORAGE_PATHS.PRODUCT.SLIDER}/${item}`} width={56} height={56} alt="상품 슬라이드 이미지1" />
          </span>
        ))}
      </article>
    </article>
  );
};

export default ProductTopImage;
