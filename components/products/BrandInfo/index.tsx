import styles from './brandInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import levisLogo from '@/public/images/levis_logo.webp';

const BrandInfo = () => {
  return (
    <article className={styles.brand_wrap}>
      <div className={styles.brand_logo_wrap}>
        <Image src={levisLogo} width={40} height={40} alt="브랜드 로고" />
      </div>
      <Flex direction="column" width="self">
        <Text size={1.5} weight={600}>{`Levi's`}</Text>
        <Text size={1.2} color="gray2">
          리바이스 ㆍ 관심 5,226
        </Text>
      </Flex>
    </article>
  );
};

export default BrandInfo;
