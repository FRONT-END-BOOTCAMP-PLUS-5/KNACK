import { useEffect, useState } from 'react';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { IPageCategory } from '@/types/category';
import { IBrandWithTagList } from '@/types/brand';
import { IOption } from '@/types/option';
import { convertFilterToBottomList } from '@/utils/search/searchBottomSheetList';

interface ISelectedBottomList {
  type: 'subCategoryId' | 'brandId' | 'size' | 'keywordColorId' | 'discount' | 'gender' | 'price';
  name: string;
  value: string | number;
}

interface UseSearchBottomSheetInitProps {
  filterQuery: ISearchProductListRequest;
  categories: IPageCategory[];
  brands: IBrandWithTagList[];
  sizes: IOption[];
  isOpen: boolean;
}

export const useSearchBottomSheetInit = ({
  filterQuery,
  categories,
  brands,
  sizes,
  isOpen,
}: UseSearchBottomSheetInitProps) => {
  const [selectedBottomList, setSelectedBottomList] = useState<ISelectedBottomList[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const hasCategories = categories.length > 0;
    const hasBrands = brands.length > 0;
    const hasSizes = sizes.length > 0;

    setIsDataReady(hasCategories && hasBrands && hasSizes);
  }, [categories, brands, sizes]);

  // filterQuery와 데이터가 준비되었을 때 selectedBottomList 초기화
  useEffect(() => {
    if (!isDataReady || !isOpen) return;

    const initialBottomList = convertFilterToBottomList(filterQuery, {
      categories,
      brands,
      sizes,
    });

    setSelectedBottomList(initialBottomList);
  }, [filterQuery, categories, brands, sizes, isDataReady, isOpen]);

  const removeFromBottomList = (type: ISelectedBottomList['type'], value: string | number) => {
    setSelectedBottomList((prev) => prev.filter((item) => !(item.type === type && item.value === value)));
  };

  const addToBottomList = (newItem: ISelectedBottomList) => {
    setSelectedBottomList((prev) => {
      return [{ ...newItem }, ...prev];
    });
  };

  const clearBottomList = () => {
    setSelectedBottomList([]);
  };

  const updateBottomList = (
    type: ISelectedBottomList['type'],
    value: string | number,
    name: string,
    shouldAdd: boolean
  ) => {
    const arrayTypes: ISelectedBottomList['type'][] = ['subCategoryId', 'keywordColorId', 'brandId', 'size'];
    const singleTypes: ISelectedBottomList['type'][] = ['gender', 'discount', 'price'];

    if (!shouldAdd) {
      setSelectedBottomList((prev) => prev.filter((item) => !(item.type === type && item.value === value)));
      return;
    }

    if (arrayTypes.includes(type)) {
      const exists = selectedBottomList.some((item) => item.type === type && item.value === value);
      if (!exists) {
        addToBottomList({ type, value, name });
      }
      return;
    }

    if (singleTypes.includes(type)) {
      setSelectedBottomList((prev) => {
        const filtered = prev.filter((item) => item.type !== type);
        return [{ type, value, name }, ...filtered];
      });
      return;
    }
  };

  return {
    selectedBottomList,
    isDataReady,
    removeFromBottomList,
    addToBottomList,
    clearBottomList,
    updateBottomList,
    setSelectedBottomList,
  };
};
