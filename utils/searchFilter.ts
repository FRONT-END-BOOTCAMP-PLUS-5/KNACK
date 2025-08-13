import { ISearchProductListRequest } from '@/types/searchProductList';

export const isActiveFilter = (optionValue: string, filterQuery: ISearchProductListRequest) => {
  switch (optionValue) {
    case 'categoryId':
      return !!(filterQuery.categoryId && filterQuery.categoryId.length > 0);
    case 'gender':
      return !!filterQuery.gender;
    case 'keywordColorId':
      return !!(filterQuery.keywordColorId && filterQuery.keywordColorId.length > 0);
    case 'discount':
      return !!(filterQuery.discountMin || filterQuery.discountMax);
    case 'brandId':
      return !!(filterQuery.brandId && filterQuery.brandId.length > 0);
    case 'size':
      return !!(filterQuery.size && filterQuery.size.length > 0);
    case 'price':
      return !!(filterQuery.priceMin || filterQuery.priceMax);
    default:
      return false;
  }
};

export const calcFilterValueLength = (optionValue: string, filterQuery: ISearchProductListRequest): number => {
  switch (optionValue) {
    case 'categoryId':
      return filterQuery.categoryId?.length || 0;
    case 'gender':
      return filterQuery.gender ? 1 : 0;
    case 'keywordColorId':
      return filterQuery.keywordColorId?.length || 0;
    case 'discount':
      const discountMin = filterQuery.discountMin;
      const discountMax = filterQuery.discountMax;
      return discountMin || discountMax ? 1 : 0;
    case 'brandId':
      return filterQuery.brandId?.length || 0;
    case 'size':
      return filterQuery.size?.length || 0;
    case 'price':
      const priceMin = filterQuery.priceMin;
      const priceMax = filterQuery.priceMax;
      return priceMin || priceMax ? 1 : 0;
    default:
      return 0;
  }
};
