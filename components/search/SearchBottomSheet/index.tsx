'use client';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import styles from './searchBottomSheet.module.scss';
import Image from 'next/image';
import BottomSheet from '@/components/common/BottomSheet';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import TabMenu from '@/components/common/TabMenu';
import Divider from '@/components/common/Divider';
import DragScroll from '@/components/common/DragScroll';
import SearchPrice from './SearchPrice';
import SearchColor from './SearchColor';
import SearchDiscount from './SearchDiscount';
import SearchCategory from './SearchCategory';
import SearchGender from './SearchGender';
import SearchBrand from './SearchBrand';
import SearchSize from './SearchSize';
import {
  DiscountValueType,
  PRODUCT_FILTER,
  PRODUCT_FILTER_GENDER,
  PRODUCT_FILTER_COLOR,
  PRODUCT_FILTER_DISCOUNT,
  PRODUCT_FILTER_PRICE,
  PRODUCT_FILTER_SORT,
  GenderValueType,
  FilterValueType,
  SortValueType,
} from '@/constraint/product';
import { categoryService } from '@/services/category';
import { brandService } from '@/services/brand';
import { optionsService } from '@/services/options';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { IPageCategory } from '@/types/category';
import { IBrandWithTagList } from '@/types/brand';
import { IOption } from '@/types/option';
import { getFilterCountById } from '@/utils/search/searchBottomSheetTab';
import { removeFilterValue } from '@/utils/search/removeFilterValue';
import { objectToQueryString } from '@/utils/queryString';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import { useSearchBottomSheetInit } from '@/hooks/useSearchBottomSheetInit';
import { useFilterCounts } from '@/hooks/useFilterCounts';
import { useRouter } from 'next/navigation';
import searchClose from '@/public/icons/close_large.svg';

interface IProps {
  activeTabId: number;
  handleSelect: (id: number, isOpen: boolean) => void;
  filterQuery: ISearchProductListRequest;
}

export default function SearchBottomSheet({ activeTabId, handleSelect, filterQuery }: IProps) {
  const { isOpen, onClose } = useBottomSheetStore();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<ISearchProductListRequest>({});
  const [categories, setCategories] = useState<IPageCategory[]>([]);
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);
  const [sizes, setSizes] = useState<IOption[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const { selectedBottomList, isDataReady, removeFromBottomList, clearBottomList, updateBottomList, initialBrands } =
    useSearchBottomSheetInit({
      filterQuery,
      categories,
      brands,
      sizes,
      isOpen,
    });

  // 필터 탭 클릭 핸들러
  const onClickFilterTab = (tabId: number) => {
    handleSelect(tabId, false);
    contentRef.current?.scrollTo({ top: 0 });
  };

  // 상품 개수 조회 커스텀 훅
  const { isLoadingCount, buttonText } = useFilterCounts(selectedFilter);

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

    if (isDataReady) {
      const category = categories
        .flatMap((category) => category.subCategories || [])
        .find((subCategory) => subCategory.id === subCategoryId);

      if (category) {
        updateBottomList('subCategoryId', subCategoryId, category.korName, !isSelected);
      }
    }
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

    if (isDataReady) {
      // 현재 브랜드 목록에서 찾기
      let brand = brands.flatMap((brandGroup) => brandGroup.brandList).find((brandItem) => brandItem.id === brandId);

      // 현재 목록에서 찾지 못하면 초기 브랜드 목록에서 찾기
      if (!brand && initialBrands.length > 0) {
        brand = initialBrands
          .flatMap((brandGroup) => brandGroup.brandList)
          .find((brandItem) => brandItem.id === brandId);
      }

      if (brand) {
        updateBottomList('brandId', brandId, brand.korName, !isSelected);
      } else {
        // 제거하는 경우는 항상 처리
        updateBottomList('brandId', brandId, '', false);
      }
    }
  };

  // 브랜드 키워드 검색
  const onChangeBrandList = (value: string) => {
    initBrands(value);
  };

  // 성별 클릭 핸들러
  const onClickGenderSelect = (gender: GenderValueType) => {
    const currentGender = selectedFilter.gender;
    const isDeselecting = currentGender === gender;

    if (isDeselecting) {
      setSelectedFilter({ ...selectedFilter, gender: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, gender: gender });
    }

    const genderFilter = PRODUCT_FILTER_GENDER.find((genderItem) => genderItem.value === gender);
    if (genderFilter) {
      updateBottomList('gender', gender, genderFilter.name, !isDeselecting);
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

    const color = PRODUCT_FILTER_COLOR.find((colorItem) => colorItem.id === colorId);
    if (color) {
      updateBottomList('keywordColorId', colorId, color.korName, !isSelected);
    }
  };

  // 할인율 클릭 핸들러
  const onClickDiscountSelect = (discountValue: DiscountValueType) => {
    const isDeselecting = selectedFilter.discount === discountValue;

    if (isDeselecting) {
      setSelectedFilter({ ...selectedFilter, discount: undefined });
    } else {
      setSelectedFilter({ ...selectedFilter, discount: discountValue });
    }

    const discount = PRODUCT_FILTER_DISCOUNT.find((discountItem) => discountItem.value === discountValue);
    if (discount) {
      updateBottomList('discount', discountValue, discount.name, !isDeselecting);
    }
  };

  // 사이즈 클릭 핸들러
  const onClickSizeSelect = (size: string) => {
    const currentSize = selectedFilter.size || [];
    const isSelected = currentSize.includes(size);

    if (isSelected) {
      setSelectedFilter({ ...selectedFilter, size: currentSize.filter((initSize) => initSize !== size) });
    } else {
      setSelectedFilter({ ...selectedFilter, size: [...currentSize, size] });
    }

    if (isDataReady) {
      const sizeOption = sizes
        .flatMap((option) => option.optionValues)
        .find((optionValue) => optionValue.name === size);
      if (sizeOption) {
        updateBottomList('size', size, sizeOption.name, !isSelected);
      }
    }
  };

  // 가격 클릭 핸들러
  const onClickPriceSelect = (price: string) => {
    const isDeselecting = selectedFilter.price === price;

    if (isDeselecting) {
      setSelectedFilter({ ...selectedFilter, price: undefined });
      updateBottomList('price', price, '', false);
    } else {
      setSelectedFilter({ ...selectedFilter, price: price });

      const priceFilter = PRODUCT_FILTER_PRICE.find((priceItem) => priceItem.value === price);
      if (priceFilter) {
        updateBottomList('price', price, priceFilter.name, true);
      }
    }
  };

  // 가격 슬라이드 핸들러
  const onChangePriceSelect = (newValue: number[]) => {
    const priceValue = `${newValue[0]}-${newValue[1]}`;
    const isDefaultRange = newValue[0] === 0 && newValue[1] === 10000000;

    if (isDefaultRange) {
      setSelectedFilter({ ...selectedFilter, price: undefined });
      updateBottomList('price', priceValue, '', false);
    } else {
      setSelectedFilter({ ...selectedFilter, price: priceValue });

      const priceFilter = PRODUCT_FILTER_PRICE.find((priceItem) => priceItem.value === priceValue);

      let displayName: string;
      if (priceFilter) {
        displayName = priceFilter.name;
      } else {
        const formatPrice = (value: number) => {
          const won = Math.floor(value / 10000);
          return `${won}만원`;
        };
        displayName = `${formatPrice(newValue[0])}-${formatPrice(newValue[1])}`;
      }

      updateBottomList('price', priceValue, displayName, true);
    }
  };

  // selectedBottomList에서 항목 제거 시 selectedFilter도 함께 업데이트
  const handleRemoveBottomListItem = (type: FilterValueType, value: string | number) => {
    removeFromBottomList(type, value);

    const newSelectedFilter = removeFilterValue(selectedFilter, type, value);
    setSelectedFilter(newSelectedFilter);
  };

  // 상품보기 버튼 클릭 핸들러
  const handleViewProducts = () => {
    const queryString = objectToQueryString(selectedFilter);
    const searchUrl = queryString ? `/search?${queryString}` : '/search';
    onClose();
    router.push(searchUrl);
  };

  const handleClearFilter = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const sort = searchParams.get('sort');
    const keyword = searchParams.get('keyword');
    const categoryId = searchParams.get('categoryId');

    const isValidSortOption = (value: string | null): value is SortValueType => {
      if (!value) return false;
      return PRODUCT_FILTER_SORT.some((item) => item.value === value);
    };

    const preservedFilter: ISearchProductListRequest = {};

    if (isValidSortOption(sort)) preservedFilter.sort = sort;
    if (keyword) preservedFilter.keyword = keyword;
    if (categoryId) preservedFilter.categoryId = [parseInt(categoryId)];

    setSelectedFilter(preservedFilter);
    clearBottomList();
  };

  return (
    <BottomSheet style={{ padding: 0, position: 'relative', overflow: 'hidden' }} title="필터" isCloseButton={false}>
      <div className={styles.bottom_sheet_layout}>
        <div className={styles.bottom_sheet_header}>
          <TabMenu
            tabs={tabs}
            selectedTab={activeTabId}
            onTabSelect={(tabId) => onClickFilterTab(tabId)}
            showScrollbar={false}
            autoScroll={true}
          />
        </div>

        <div ref={contentRef} className={`${styles.bottom_sheet_content} ${styles.contents_container}`}>
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
              {selectedBottomList.map((item, index) => (
                <Flex
                  align="center"
                  gap={2}
                  width="self"
                  paddingHorizontal={4}
                  key={`${item.type}-${item.value}-${index}`}
                >
                  <Text size={1.3} weight={600} color="gray4">
                    {item.name}
                  </Text>
                  <span onClick={() => handleRemoveBottomListItem(item.type, item.value)} style={{ cursor: 'pointer' }}>
                    <Image src={searchClose} alt="close" width={16} height={16} style={{ opacity: 0.5 }} />
                  </span>
                </Flex>
              ))}
            </DragScroll>
          </Flex>
          <Flex className={styles.bottom_sheet_bottom} paddingHorizontal={8} paddingVertical={8} gap={8}>
            <button className={styles.bottom_sheet_bottom_clear} onClick={handleClearFilter}>
              초기화
            </button>
            <button
              className={styles.bottom_sheet_bottom_submit}
              disabled={isLoadingCount}
              onClick={handleViewProducts}
            >
              {buttonText()}
            </button>
          </Flex>
        </section>
      </div>
    </BottomSheet>
  );
}
