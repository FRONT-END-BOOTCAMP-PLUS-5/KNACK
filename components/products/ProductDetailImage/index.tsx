import styles from './productDetailImage.module.scss';
import Text from '@/components/common/Text';
import { STORAGE_PATHS } from '@/constraint/auth';
import Image from 'next/image';

interface IProps {
  detailImage?: string | null;
}

const ProductDetailImage = ({ detailImage }: IProps) => {
  const detailImages = detailImage?.split(',');

  return (
    <section className={styles.container}>
      <Text tag="h2" size={1.7} weight={600} marginLeft={16} marginRight={16} paddingTop={24} marginBottom={16}>
        상세 정보
      </Text>
      <div className={styles.image_box}>
        {detailImages?.map((item) => (
          <Image key={item} src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item}`} fill alt="상품 이미지" />
        ))}
      </div>
    </section>
  );
};

export default ProductDetailImage;
