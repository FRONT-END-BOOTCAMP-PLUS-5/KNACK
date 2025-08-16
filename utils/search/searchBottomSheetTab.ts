import { ISearchProductListRequest } from '@/types/searchProductList';

export function getFilterCountById(selectedFilter: ISearchProductListRequest, filterId: number): number | undefined {
  switch (filterId) {
    case 1:
      return selectedFilter.subCategoryId?.length || undefined;
    case 2:
      return selectedFilter.gender ? 1 : undefined;
    case 3:
      return selectedFilter.keywordColorId?.length || undefined;
    case 4:
      return selectedFilter.discount ? 1 : undefined;
    case 5:
      return selectedFilter.brandId?.length || undefined;
    case 6:
      return selectedFilter.size?.length || undefined;
    case 7:
      return selectedFilter.price ? 1 : undefined;
    default:
      return undefined;
  }
}
