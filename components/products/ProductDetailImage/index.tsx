import Flex from '@/components/common/Flex';
import styles from './productDetailImage.module.scss';
import Text from '@/components/common/Text';
import DynamicImage from '../DynamicImage';
import { STORAGE_PATHS } from '@/constraint/auth';

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

      <Flex direction="column">
        {detailImages?.map((item, index) => (
          <DynamicImage key={item} src={`${STORAGE_PATHS?.PRODUCT?.DETAIL}/${item}`} alt={'상세이미지' + index} />
        ))}
      </Flex>
    </section>
  );
};

export default ProductDetailImage;
