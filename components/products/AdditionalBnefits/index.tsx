import Text from '@/components/common/Text';
import styles from './additionalBnefits.module.scss';
import Flex from '@/components/common/Flex';

const AdditionalBnefits = () => {
  return (
    <section className={styles.additional_bnefits_wrap}>
      <Text tag="h2" size={1.4} paddingBottom={12}>
        추가 혜택
      </Text>
      <Flex paddingVertical={4}>
        <Text className={styles.title} size={1.2} color="gray2" marginRight={10}>
          포인트
        </Text>
        <Text size={1.3}>계좌 간편결제 시 1% 적립</Text>
      </Flex>
      <Flex paddingVertical={4}>
        <Text className={styles.title} size={1.2} color="gray2" marginRight={10}>
          결제
        </Text>
        <Text size={1.3}>크림카드 최대 20만원 상당 혜택</Text>
      </Flex>
    </section>
  );
};

export default AdditionalBnefits;
