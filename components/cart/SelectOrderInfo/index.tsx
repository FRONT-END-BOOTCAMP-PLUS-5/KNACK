'use client';

import Divider from '@/components/common/Divider';
import styles from './selectOrderInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { ICart } from '@/types/cart';

interface IProps {
  selectCarts: ICart[];
}

const SelectOrderInfo = ({ selectCarts }: IProps) => {
  return (
    <section className={styles.select_order_info_wrap}>
      <h2 className={styles.select_order_title}>선택 주문정보</h2>
      <Divider height={1} paddingHorizontal={16} />
      <Flex paddingHorizontal={16} paddingVertical={12} gap={4} direction="column">
        <Flex justify="between" paddingVertical={3}>
          <Text size={1.4} color="gray1">
            총 상품금액
          </Text>
          <Text size={1.4} color="black1">
            {selectCarts?.reduce((acc, cur) => acc + (cur?.product?.price ?? 0), 0).toLocaleString()}원
          </Text>
        </Flex>
        <Flex justify="between" paddingVertical={3}>
          <Text size={1.4} color="gray1">
            총 배송비
          </Text>
          <Text size={1.4} color="black1">
            무료
          </Text>
        </Flex>
      </Flex>
      <Divider height={1} paddingHorizontal={16} />
      <Flex justify="between" paddingVertical={15} paddingHorizontal={16} align="center">
        <Text size={1.4} color="black1" weight={600}>
          총 예상 결제금액
        </Text>
        <Text size={1.6} color="black1" weight={700}>
          {selectCarts?.reduce((acc, cur) => acc + (cur?.product?.price ?? 0), 0).toLocaleString()}
        </Text>
      </Flex>
    </section>
  );
};

export default SelectOrderInfo;
