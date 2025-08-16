import { ISearchProductListRequest } from '@/types/searchProductList';

export const isActiveFilter = (optionValue: string, filterQuery: ISearchProductListRequest) => {
  switch (optionValue) {
    case 'subCategoryId':
      return !!(filterQuery.subCategoryId && filterQuery.subCategoryId.length > 0);
    case 'gender':
      return !!filterQuery.gender;
    case 'keywordColorId':
      return !!(filterQuery.keywordColorId && filterQuery.keywordColorId.length > 0);
    case 'discount':
      return !!filterQuery.discount;
    case 'brandId':
      return !!(filterQuery.brandId && filterQuery.brandId.length > 0);
    case 'size':
      return !!(filterQuery.size && filterQuery.size.length > 0);
    case 'price':
      return !!filterQuery.price;
    default:
      return false;
  }
};

export const calcFilterValueLength = (optionValue: string, filterQuery: ISearchProductListRequest): number => {
  switch (optionValue) {
    case 'subCategoryId':
      return filterQuery.subCategoryId?.length || 0;
    case 'gender':
      return filterQuery.gender ? 1 : 0;
    case 'keywordColorId':
      return filterQuery.keywordColorId?.length || 0;
    case 'discount':
      return filterQuery.discount ? 1 : 0;
    case 'brandId':
      return filterQuery.brandId?.length || 0;
    case 'size':
      return filterQuery.size?.length || 0;
    case 'price':
      return filterQuery.price ? 1 : 0;
    default:
      return 0;
  }
};
