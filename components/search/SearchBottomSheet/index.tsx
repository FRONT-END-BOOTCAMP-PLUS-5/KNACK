'use client';
import styles from './searchBottomSheet.module.scss';
import BottomSheet from '@/components/common/BottomSheet';
import { PRODUCT_FILTER } from '@/constraint/product';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import TabMenu from '@/components/common/TabMenu';
import Divider from '@/components/common/Divider';
import SearchPrice from './SearchPrice';
import SearchColor from './SearchColor';
import SearchDiscount from './SearchDiscount';
import Image from 'next/image';
import searchClose from '@/public/icons/close_large.svg';
import SearchCategory from './SearchCategory';
import SearchGender from './SearchGender';
import SearchBrand from './SearchBrand';
import SearchSize from './SearchSize';

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
    <BottomSheet style={{ padding: 0, position: 'relative' }} title="필터" isCloseButton={false}>
      <div className={styles.bottom_sheet_header}>
        <TabMenu
          tabs={tabs}
          selectedTab={select}
          onTabSelect={(tabId) => handleSelect(tabId, false)}
          showScrollbar={false}
          autoScroll={true}
        />
      </div>

      <div className={`${styles.bottom_sheet_content} ${styles.contents_container}`}>
        {select === 1 && <SearchCategory />}
        {select === 2 && <SearchGender />}
        {select === 3 && <SearchColor />}
        {select === 4 && <SearchDiscount />}
        {select === 5 && <SearchBrand />}
        {select === 6 && <SearchSize />}
        {select === 7 && <SearchPrice />}
      </div>

      <section className={styles.bottom_sheet_bottom_wrap}>
        <Divider height={1} />
        <Flex justify="between" align="center" className={styles.bottom_sheet_bottom_selected_filter}>
          <Flex align="center" gap={2}>
            <Text size={1.3} weight={600} color="gray4">
              선택필터
            </Text>
            <span>
              <Image src={searchClose} alt="close" width={16} height={16} style={{ opacity: 0.5 }} />
            </span>
          </Flex>
        </Flex>
        <Flex className={styles.bottom_sheet_bottom} paddingHorizontal={8} paddingVertical={8} gap={8}>
          <button className={styles.bottom_sheet_bottom_clear}>초기화</button>
          <button className={styles.bottom_sheet_bottom_submit}>상품보기</button>
        </Flex>
      </section>
    </BottomSheet>
  );
}
