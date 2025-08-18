import { ISearchProductListRequest } from '@/types/searchProductList';

type FilterType = 'subCategoryId' | 'brandId' | 'size' | 'keywordColorId' | 'discount' | 'gender' | 'price';

export const removeFilterValue = (
  selectedFilter: ISearchProductListRequest,
  type: FilterType,
  value: string | number
): ISearchProductListRequest => {
  switch (type) {
    case 'subCategoryId': {
      const newSubCategoryIds = selectedFilter.subCategoryId?.filter((id) => id !== value) || [];
      return {
        ...selectedFilter,
        subCategoryId: newSubCategoryIds.length > 0 ? newSubCategoryIds : undefined,
      };
    }
    case 'brandId': {
      const newBrandIds = selectedFilter.brandId?.filter((id) => id !== value) || [];
      return {
        ...selectedFilter,
        brandId: newBrandIds.length > 0 ? newBrandIds : undefined,
      };
    }
    case 'size': {
      const newSizes = selectedFilter.size?.filter((size) => size !== value) || [];
      return {
        ...selectedFilter,
        size: newSizes.length > 0 ? newSizes : undefined,
      };
    }
    case 'keywordColorId': {
      const newColorIds = selectedFilter.keywordColorId?.filter((id) => id !== value) || [];
      return {
        ...selectedFilter,
        keywordColorId: newColorIds.length > 0 ? newColorIds : undefined,
      };
    }
    case 'gender':
      return { ...selectedFilter, gender: undefined };
    case 'discount':
      return { ...selectedFilter, discount: undefined };
    case 'price':
      return { ...selectedFilter, price: undefined };
    default:
      return selectedFilter;
  }
};
