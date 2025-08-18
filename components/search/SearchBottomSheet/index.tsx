'use client';
import styles from './searchBottomSheet.module.scss';
import BottomSheet from '@/components/common/BottomSheet';
import { DiscountValue, PRODUCT_FILTER } from '@/constraint/product';
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
import { optionsService } from '@/services/options';
import { IOption } from '@/types/option';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import DragScroll from '@/components/common/DragScroll';

interface IProps {
  activeTabId: number;
  handleSelect: (id: number, isOpen: boolean) => void;
  filterQuery: ISearchProductListRequest;
}

interface ISelectedBottomList {
  id: number;
  type: 'categoryId' | 'subCategoryId' | 'brandId' | 'size' | 'keywordColorId' | 'discount' | 'gender' | 'price';
  name: string;
  value: string;
}

export default function SearchBottomSheet({ activeTabId, handleSelect, filterQuery }: IProps) {
  const { isOpen } = useBottomSheetStore();
  const [selectedFilter, setSelectedFilter] = useState<ISearchProductListRequest>({});
  const [selectedBottomList, setSelectedBottomList] = useState<ISelectedBottomList[]>([]);
  const [categories, setCategories] = useState<IPageCategory[]>([]);
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);
  const [sizes, setSizes] = useState<IOption[]>([]);

  // TODO: 조회 안하고 바텀시트 닫으면 filterQuery로 selectedFilter 초기화 해야함

  const { getCategories } = categoryService;
  const { getBrands } = brandService;
  const { getOptions } = optionsService;

  const tabs = useMemo(() => {
    return PRODUCT_FILTER.map((item) => ({
      id: item.id,
      name: item.name,
      badge: getFilterCountById(selectedFilter, item.id),
    }));
  }, [selectedFilter]);

  useEffect(() => {
    // 초기 데이터 저장
    setSelectedFilter(filterQuery);
    console.log('@@@@@@@@filterQuery : ', filterQuery);
  }, [filterQuery, isOpen]);

  // 카테고리 데이터 호출 로직
  const initCategories = useCallback(async () => {
    await getCategories()
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.result);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.log(error.message);
        }
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

  // 사이즈 데이터 호출 로직
  const initSizes = useCallback(async () => {
    await getOptions().then((res) => {
      setSizes(res);
    });
  }, [getOptions]);

  useEffect(() => {
    // 카테고리 데이터 호출
    initCategories();
  }, [initCategories]);

  useEffect(() => {
    // 브랜드 데이터 호출
    initBrands();
  }, [initBrands]);

  useEffect(() => {
    // 사이즈 데이터 호출
    initSizes();
  }, [initSizes]);

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

  // 성별 클릭 핸들러
  const onClickGenderSelect = (gender: 'm' | 'f' | 'all') => {
    const currentGender = selectedFilter.gender;
    if (currentGender === gender) {
      setSelectedFilter({ ...selectedFilter, gender: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, gender: gender });
    }
  };

  // 색상 클릭 핸들러
  const onClickColorSelect = (colorId: number) => {
    const currentColorIds = selectedFilter.keywordColorId || [];
    const isSelected = currentColorIds.includes(colorId);

    let newColorIds: number[];
    if (isSelected) {
      newColorIds = currentColorIds.filter((id) => id !== colorId);
    } else {
      newColorIds = [...currentColorIds, colorId];
    }

    const newSelectedFilter = {
      ...selectedFilter,
      keywordColorId: newColorIds.length > 0 ? newColorIds : undefined,
    };

    setSelectedFilter(newSelectedFilter);
  };

  // 할인율 클릭 핸들러
  const onClickDiscountSelect = (discountValue: DiscountValue) => {
    if (selectedFilter.discount === discountValue) {
      setSelectedFilter({ ...selectedFilter, discount: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, discount: discountValue });
    }
  };

  // 사이즈 클릭 핸들러
  const onClickSizeSelect = (size: string) => {
    const currentSize = selectedFilter.size || [];
    if (currentSize.includes(size)) {
      setSelectedFilter({ ...selectedFilter, size: currentSize.filter((initSize) => initSize !== size) });
    } else {
      setSelectedFilter({ ...selectedFilter, size: [...currentSize, size] });
    }
  };

  // 가격 클릭 핸들러
  const onClickPriceSelect = (price: string) => {
    if (selectedFilter.price === '0-10000000') {
      setSelectedFilter({ ...selectedFilter, price: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, price: price });
    }
  };

  // 가격 슬라이드 핸들러
  const onChangePriceSelect = (newValue: number[]) => {
    if (newValue[0] === 0 && newValue[1] === 10000000) {
      setSelectedFilter({ ...selectedFilter, price: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, price: `${newValue[0]}-${newValue[1]}` });
    }
  };

  const handleClearFilter = () => {
    setSelectedFilter({ price: undefined });
  };

  return (
    <BottomSheet style={{ padding: 0, position: 'relative' }} title="필터" isCloseButton={false}>
      <div className={styles.bottom_sheet_header}>
        <TabMenu
          tabs={tabs}
          selectedTab={activeTabId}
          onTabSelect={(tabId) => handleSelect(tabId, false)}
          showScrollbar={false}
          autoScroll={true}
        />
      </div>

      <div className={`${styles.bottom_sheet_content} ${styles.contents_container}`}>
        {activeTabId === 1 && (
          <SearchCategory
            selectedFilter={selectedFilter}
            categories={categories}
            onClickSubCategorySelect={onClickSubCategorySelect}
          />
        )}
        {activeTabId === 2 && (
          <SearchGender selectedFilter={selectedFilter} onClickGenderSelect={onClickGenderSelect} />
        )}
        {activeTabId === 3 && <SearchColor selectedFilter={selectedFilter} onClickColorSelect={onClickColorSelect} />}
        {activeTabId === 4 && (
          <SearchDiscount selectedFilter={selectedFilter} onClickDiscountSelect={onClickDiscountSelect} />
        )}
        {activeTabId === 5 && (
          <SearchBrand
            selectedFilter={selectedFilter}
            brands={brands}
            onClickBrandSelect={onClickBrandSelect}
            onChangeBrandList={onChangeBrandList}
          />
        )}
        {activeTabId === 6 && (
          <SearchSize selectedFilter={selectedFilter} sizes={sizes} onClickSizeSelect={onClickSizeSelect} />
        )}
        {activeTabId === 7 && (
          <SearchPrice
            selectedFilter={selectedFilter}
            onClickPriceSelect={onClickPriceSelect}
            onChangePriceSelect={onChangePriceSelect}
          />
        )}
      </div>

      <section className={styles.bottom_sheet_bottom_wrap}>
        <Divider height={1} />
        <Flex justify="between" align="center" className={styles.bottom_sheet_bottom_selected_filter}>
          <DragScroll showScrollbar={false}>
            <Flex align="center" gap={2} width="self" paddingHorizontal={4}>
              <Text size={1.3} weight={600} color="gray4" key={'item.id'}>
                {'item.name'}
              </Text>
              <span>
                <Image src={searchClose} alt="close" width={16} height={16} style={{ opacity: 0.5 }} />
              </span>
            </Flex>
          </DragScroll>
        </Flex>
        <Flex className={styles.bottom_sheet_bottom} paddingHorizontal={8} paddingVertical={8} gap={8}>
          <button className={styles.bottom_sheet_bottom_clear} onClick={handleClearFilter}>
            초기화
          </button>
          <button className={styles.bottom_sheet_bottom_submit}>상품보기</button>
        </Flex>
      </section>
    </BottomSheet>
  );
}
