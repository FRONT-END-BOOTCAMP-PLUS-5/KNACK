'use client';

import styles from './defaultInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import { IProduct } from '@/types/productDetail';

interface IProps {
  data?: IProduct;
}

const DefaultInfo = ({ data }: IProps) => {
  const { onOpen } = useBottomSheetStore();

  return (
    <article className={styles.default_info}>
      <Flex direction="column" gap={2}>
        <Text size={1.3} color="black1">
          즉시 구매가
        </Text>
        <Text size={2} color="black1" weight={700}>
          {data?.price?.toLocaleString()}원
        </Text>
      </Flex>
      <Flex direction="column" marginVertical={20}>
        <Text size={1.7} marginBottom={4}>
          {data?.engName}
        </Text>
        <Text size={1.3} color="gray1" marginBottom={10}>
          {data?.korName}
        </Text>
        <Flex gap={6}>
          <Text size={1.3}>
            ★
            {data?.reviews &&
              (data?.reviews?.reduce((acc, cur) => acc + (cur?.rating ?? 0), 0) ?? 0 / data?.reviews?.length)}
          </Text>
          <Text size={1.3}>리뷰 {data?._count?.reviews}</Text>
        </Flex>
      </Flex>
      <button className={styles.size_open_button} onClick={onOpen}>
        모든 사이즈
      </button>
      <Flex className={styles.origin_info_box} paddingVertical={20}>
        <Flex direction="column" gap={4} width="self">
          <Text color="gray2" size={1.2}>
            모델번호
          </Text>
          <Text color="gray1" size={1.3}>
            {data?.modelNumber}
          </Text>
        </Flex>
        <Flex direction="column" gap={4} width="self" className={styles.flex_border}>
          <Text color="gray2" size={1.2}>
            출시일
          </Text>
          <Text color="gray1" size={1.3}>
            {data?.releaseDate}
          </Text>
        </Flex>
        <Flex direction="column" gap={4} width="self" className={styles.flex_border}>
          <Text color="gray2" size={1.2}>
            대표 색상
          </Text>
          <Text color="gray1" size={1.3}>
            {data?.colorEngName}
          </Text>
        </Flex>
      </Flex>
    </article>
  );
};

export default DefaultInfo;
