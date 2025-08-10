'use client';
import BottomSheet from '@/components/common/BottomSheet';
import { PRODUCT_FILTER } from '@/constraint/product';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import TabMenu from '@/components/common/TabMenu';

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
      <BottomSheet style={{ padding: 0 }}>
        <Flex justify="center" paddingVertical={16}>
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
        />
      </BottomSheet>
    </div>
  );
}
