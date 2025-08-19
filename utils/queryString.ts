import { SORT_VALUE_KEY, SortValueType } from '@/constraint/product';
import { ISearchProductListRequest } from '@/types/searchProductList';

export interface IQueryParams {
  keyword?: string;
  keywordColorId?: string;
  brandId?: string;
  categoryId?: string;
  subCategoryId?: string;
  price?: string;
  discount?: string;
  size?: string;
  benefit?: boolean;
  gender?: string;
  soldOutInvisible?: string;
  sort?: SortValueType;
  cursor?: string;
}

const objectToQueryString = (obj: ISearchProductListRequest | IQueryParams): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(','));
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
};

const queryStringToObject = (queryParams: IQueryParams): ISearchProductListRequest => {
  const convertedQuery: ISearchProductListRequest = {};

  const parseNumberArray = (value?: string) => {
    if (!value) return undefined;
    return value.split(',').map((id) => parseInt(id.trim(), 10));
  };

  const parseStringArray = (value?: string) => {
    if (!value) return undefined;
    return value.split(',').map((v) => v.trim());
  };

  if (queryParams.keyword) convertedQuery.keyword = queryParams.keyword;
  if (queryParams.gender) convertedQuery.gender = queryParams.gender;
  if (queryParams.benefit) convertedQuery.benefit = queryParams.benefit;
  if (queryParams.sort && SORT_VALUE_KEY.includes(queryParams.sort)) convertedQuery.sort = queryParams.sort;

  if (queryParams.cursor) convertedQuery.cursor = queryParams.cursor;
  if (queryParams.soldOutInvisible) convertedQuery.soldOutInvisible = queryParams.soldOutInvisible === 'true';
  if (queryParams.price) convertedQuery.price = queryParams.price;
  if (queryParams.discount) convertedQuery.discount = queryParams.discount;

  convertedQuery.keywordColorId = parseNumberArray(queryParams.keywordColorId);
  convertedQuery.brandId = parseNumberArray(queryParams.brandId);
  convertedQuery.categoryId = parseNumberArray(queryParams.categoryId);
  convertedQuery.subCategoryId = parseNumberArray(queryParams.subCategoryId);
  convertedQuery.size = parseStringArray(queryParams.size);

  return convertedQuery;
};

export { objectToQueryString, queryStringToObject };
