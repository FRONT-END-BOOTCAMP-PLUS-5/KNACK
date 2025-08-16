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
import { ISearchProductListRequest } from '@/types/searchProductList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoryService } from '@/services/category';
import { IPageCategory } from '@/types/category';
import { getFilterCountById } from '@/utils/search/searchBottomSheetTab';
import { brandService } from '@/services/brand';
import { IBrandWithTagList } from '@/types/brand';

interface IProps {
  select: number;
  handleSelect: (id: number, isOpen: boolean) => void;
  filterQuery: ISearchProductListRequest;
}

export default function SearchBottomSheet({ select, handleSelect, filterQuery }: IProps) {
  const [selectedFilter, setSelectedFilter] = useState<ISearchProductListRequest>({});
  const [categories, setCategories] = useState<IPageCategory[]>([]);
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);

  const { getCategories } = categoryService;
  const { getBrands } = brandService;

  const tabs = useMemo(() => {
    return PRODUCT_FILTER.map((item) => ({
      id: item.id,
      name: item.name,
      badge: getFilterCountById(selectedFilter, item.id),
    }));
  }, [selectedFilter]);

  useEffect(() => {
    // 초기 데이터 저장
    if (!filterQuery) return;
    setSelectedFilter(filterQuery);
  }, [filterQuery]);

  // 카테고리 데이터 호출 로직
  const initCategories = useCallback(async () => {
    await getCategories().then((res) => {
      setCategories(res);
    });
  }, [getCategories]);

  // 브랜드 데이터 호출 로직
  const initBrands = useCallback(
    async (keyword?: string) => {
      await getBrands({ keyword: keyword }).then((res) => {
        if (res.status === 200) {
          setBrands(res.result);
        }
      });
    },
    [getBrands]
  );

  useEffect(() => {
    // 카테고리 데이터 호출
    initCategories();
  }, [initCategories]);

  useEffect(() => {
    // 브랜드 데이터 호출
    initBrands();
  }, [initBrands]);

  // 서브카테고리 클릭 핸들러
  const onClickSubCategorySelect = (subCategoryId: number) => {
    const currentSubCategoryIds = selectedFilter.subCategoryId || [];
    const isSelected = currentSubCategoryIds.includes(subCategoryId);

    let newSubCategoryIds: number[];
    if (isSelected) {
      newSubCategoryIds = currentSubCategoryIds.filter((id) => id !== subCategoryId);
    } else {
      newSubCategoryIds = [...currentSubCategoryIds, subCategoryId];
    }

    const newSelectedFilter = {
      ...selectedFilter,
      subCategoryId: newSubCategoryIds.length > 0 ? newSubCategoryIds : undefined,
    };

    setSelectedFilter(newSelectedFilter);
  };

  // 브랜드 클릭 핸들러
  const onClickBrandSelect = (brandId: number) => {
    const currentBrandIds = selectedFilter.brandId || [];
    const isSelected = currentBrandIds.includes(brandId);

    let newBrandIds: number[];
    if (isSelected) {
      newBrandIds = currentBrandIds.filter((id) => id !== brandId);
    } else {
      newBrandIds = [...currentBrandIds, brandId];
    }

    const newSelectedFilter = {
      ...selectedFilter,
      brandId: newBrandIds.length > 0 ? newBrandIds : undefined,
    };
    setSelectedFilter(newSelectedFilter);
  };

  // 브랜드 키워드 검색
  const onChangeBrandList = (value: string) => {
    initBrands(value);
  };

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
        {select === 1 && (
          <SearchCategory
            selectedFilter={selectedFilter}
            categories={categories}
            onClickSubCategorySelect={onClickSubCategorySelect}
          />
        )}
        {select === 2 && <SearchGender />}
        {select === 3 && <SearchColor />}
        {select === 4 && <SearchDiscount />}
        {select === 5 && (
          <SearchBrand
            selectedFilter={selectedFilter}
            brands={brands}
            onClickBrandSelect={onClickBrandSelect}
            onChangeBrandList={onChangeBrandList}
          />
        )}
        {select === 6 && <SearchSize />}
        {select === 7 && <SearchPrice />}
      </div>

      <section className={styles.bottom_sheet_bottom_wrap}>
        <Divider height={1} />
        <Flex justify="between" align="center" className={styles.bottom_sheet_bottom_selected_filter}>
          <Flex align="center" gap={2}>
            <Text size={1.3} weight={600} color="gray4" key={'item.id'}>
              {'item.name'}
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
