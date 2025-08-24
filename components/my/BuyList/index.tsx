import Text from '@/components/common/Text';
import styles from './buyList.module.scss';
import Flex from '@/components/common/Flex';
import { useRouter } from 'next/navigation';


const BuyList = ({ all, delivering, completed }: { all: number; delivering: number; completed: number }) => {

  const router = useRouter();

  return (
    <section className={styles.buy_list_section}>
      <Text size={1.6} weight={700} paddingBottom={8}>
        구매 내역
      </Text>
      <Flex className={styles.buy_list} align="center">
        <Flex direction="column" align="center" marginVertical={14}>
          <Text size={1.2}>전체</Text>
          <Text size={1.5} weight={700} lineHeight="20px" marginTop={2}>
            <button className={styles.button_my} onClick={() => router.push('/my/buying/?tab=all')}>{all}</button>
          </Text>
        </Flex>
        <Flex direction="column" align="center" marginVertical={14} className={styles.box_border}>
          <Text size={1.2}>배송중</Text>
          <Text size={1.5} weight={700} lineHeight="20px" marginTop={2}>
            <button className={styles.button_my} onClick={() => router.push('/my/buying/?tab=pending')}>{delivering}</button>
          </Text>
        </Flex>
        <Flex direction="column" align="center" marginVertical={14}>
          <Text size={1.2}>완료</Text>
          <Text size={1.5} weight={700} lineHeight="20px" marginTop={2}>
            <button className={styles.button_my} onClick={() => router.push('/my/buying/?tab=done')}>{completed}</button>
          </Text>
        </Flex>
      </Flex>
    </section>
  );
};

export default BuyList;
