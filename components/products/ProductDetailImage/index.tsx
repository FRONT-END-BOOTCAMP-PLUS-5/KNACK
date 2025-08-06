import styles from './productDetailImage.module.scss';
import Text from '@/components/common/Text';
import { STORAGE_PATHS } from '@/constraint/auth';
import Image from 'next/image';

const ProductDetailImage = () => {
  return (
    <section className={styles.container}>
      <Text tag="h2" size={1.7} weight={600} marginLeft={16} marginRight={16} paddingTop={24} marginBottom={16}>
        상세 정보
      </Text>
      <div className={styles.image_box}>
        <Image
          src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/levis_nike_trucker_jacket_lightblue-thumbnail.webp`}
          fill
          alt="상품 대표 이미지"
        />
      </div>
    </section>
  );
};

export default ProductDetailImage;
