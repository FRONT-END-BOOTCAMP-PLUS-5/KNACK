'use client';
import styles from './searchBottomSheet.module.scss';
import BottomSheet from '@/components/common/BottomSheet';
import { PRODUCT_FILTER } from '@/constraint/product';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import TabMenu from '@/components/common/TabMenu';
import Divider from '@/components/common/Divider';
import SearchPrice from './SearchPrice';

interface IProps {
  select: number;
  handleSelect: (id: number, isOpen: boolean) => void;
}

export default function SearchBottomSheet({ select, handleSelect }: IProps) {
  const tabs = PRODUCT_FILTER.map((item) => ({
    id: item.id,
    name: item.name,
    badge: 1, //TODO: url로 계산하는 로직 필요
  }));

  return (
    <div>
      <BottomSheet style={{ padding: 0, position: 'relative' }}>
        <Flex justify="center" paddingVertical={16} className={styles.bottom_sheet_header}>
          <Text tag="h2" size={1.8} weight={600}>
            필터
          </Text>
        </Flex>
        <TabMenu
          tabs={tabs}
          selectedTab={select}
          onTabSelect={(tabId) => handleSelect(tabId, false)}
          showScrollbar={false}
          autoScroll={true}
          style={{ position: 'sticky', top: '52px' }}
        />

        {/* <SearchDiscount /> */}
        <SearchPrice />

        <section className={styles.bottom_sheet_bottom_wrap}>
          <Divider height={1} />
          <Flex className={styles.bottom_sheet_bottom} paddingHorizontal={8} paddingVertical={8} gap={8}>
            <button className={styles.bottom_sheet_bottom_clear}>초기화</button>
            <button className={styles.bottom_sheet_bottom_submit}>상품보기</button>
          </Flex>
        </section>
      </BottomSheet>
    </div>
  );
}
