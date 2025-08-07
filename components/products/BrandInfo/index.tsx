import styles from './brandInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IBrand } from '@/types/productDetail';
import Image from 'next/image';

interface IProps {
  brandData?: IBrand;
}

const BrandInfo = ({ brandData }: IProps) => {
  return (
    <article className={styles.brand_wrap}>
      <div className={styles.brand_logo_wrap}>
        <Image
          src={`${STORAGE_PATHS.PRODUCT.LOGO}/${brandData?.logoImage ?? ''}`}
          width={40}
          height={40}
          alt="브랜드 로고"
        />
      </div>
      <Flex direction="column" width="self">
        <Text size={1.5} weight={600}>
          {brandData?.engName}
        </Text>
        <Text size={1.2} color="gray2">
          {brandData?.korName} ㆍ 관심 5,226
        </Text>
      </Flex>
    </article>
  );
};

export default BrandInfo;
