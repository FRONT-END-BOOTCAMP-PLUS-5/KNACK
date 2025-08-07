import styles from './defaultInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';

const DefaultInfo = () => {
  return (
    <article className={styles.default_info}>
      <Flex direction="column" gap={2}>
        <Text size={1.3} color="black1">
          즉시 구매가
        </Text>
        <Text size={2} color="black1" weight={700}>
          629,000원
        </Text>
      </Flex>
      <Flex direction="column" marginVertical={20}>
        <Text size={1.7} marginBottom={4}>
          {`Levi's x Nike Trucker Jacket Light Blue`}
        </Text>
        <Text size={1.3} color="gray1" marginBottom={10}>
          리바이스 x 나이키 트러커 자켓 라이트 블루
        </Text>
        <Flex gap={6}>
          <Text size={1.3}>★ 4.7</Text>
          <Text size={1.3}>리뷰 70</Text>
        </Flex>
      </Flex>
      <button className={styles.size_open_button}>모든 사이즈</button>
      <Flex className={styles.origin_info_box} paddingVertical={20}>
        <Flex direction="column" gap={4} width="self">
          <Text color="gray2" size={1.2}>
            발매가
          </Text>
          <Text color="gray1" size={1.3}>
            279,000원
          </Text>
        </Flex>
        <Flex direction="column" gap={4} width="self" className={styles.flex_border}>
          <Text color="gray2" size={1.2}>
            모델번호
          </Text>
          <Text color="gray1" size={1.3}>
            002TM0000
          </Text>
        </Flex>
        <Flex direction="column" gap={4} width="self" className={styles.flex_border}>
          <Text color="gray2" size={1.2}>
            출시일
          </Text>
          <Text color="gray1" size={1.3}>
            25/07/10
          </Text>
        </Flex>
        <Flex direction="column" gap={4} width="self" className={styles.flex_border}>
          <Text color="gray2" size={1.2}>
            대표 색상
          </Text>
          <Text color="gray1" size={1.3}>
            Light Blue
          </Text>
        </Flex>
      </Flex>
    </article>
  );
};

export default DefaultInfo;
