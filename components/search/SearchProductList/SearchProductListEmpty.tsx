'use client';
import { useSearchParams } from 'next/navigation';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import styles from './searchProductList.module.scss';
import { useClearProductFilter } from '@/hooks/search/useClearProductFilter';

export default function SearchProductListEmpty() {
  const { clearFilters } = useClearProductFilter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  const emptyText = keyword ? '검색결과가 없습니다.' : '선택한 카테고리, 필터와 일치하는 결과가 없습니다.';

  return (
    <Flex direction="column" align="center" justify="center" width="full" paddingVertical={50}>
      <Text size={1.3} color="gray3" weight={400} className={styles.empty_text}>
        {emptyText}
      </Text>
      {!keyword && (
        <button className={styles.empty_button} type="button" onClick={clearFilters}>
          필터 초기화
        </button>
      )}
    </Flex>
  );
}
