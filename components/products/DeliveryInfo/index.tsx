import Text from '@/components/common/Text';
import styles from './deliveryInfo.module.scss';
import Flex from '@/components/common/Flex';
import Image from 'next/image';
import deliveryIcon from '@/public/icons/delivery_icon.png';

const DeliveryInfo = () => {
  return (
    <section className={styles.delivery_info_wrap}>
      <Text tag="h2" size={1.4} paddingBottom={12}>
        배송 정보
      </Text>
      <Flex gap={16} align="center">
        <Image src={deliveryIcon} width={40} height={40} alt="배송 아이콘" />
        <Flex direction="column">
          <Text size={1.2} weight={600}>
            일반 배송
            <Text size={1.2} tag="span" marginLeft={4}>
              3,000원
            </Text>
          </Text>
          <Text size={1.2} color="gray2" marginTop={4}>
            검수 후 배송 ㆍ 5-7일 내 도착 예정
          </Text>
        </Flex>
      </Flex>
    </section>
  );
};

export default DeliveryInfo;
