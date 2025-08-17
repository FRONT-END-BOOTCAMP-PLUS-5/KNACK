import { ISearchProductListRequest, SortOption } from '@/types/searchProductList';

export interface IQueryParams {
  keyword?: string;
  keywordColorId?: string;
  brandId?: string;
  categoryId?: string;
  subCategoryId?: string;
  price?: string;
  discount?: string;
  size?: string;
  benefit?: 'under_price';
  gender?: string;
  soldOutInvisible?: string;
  sort?: SortOption;
  cursor?: string;
}

const objectToQueryString = (obj: ISearchProductListRequest): string => {
  const params = new URLSearchParams();

  if (obj.keyword) params.set('keyword', obj.keyword);
  if (obj.gender) params.set('gender', obj.gender);
  if (obj.benefit) params.set('benefit', obj.benefit);
  if (obj.sort) params.set('sort', obj.sort);
  if (obj.cursor) params.set('cursor', obj.cursor);
  if (obj.price) params.set('price', obj.price);
  if (obj.discount) params.set('discount', obj.discount);
  if (obj.soldOutInvisible !== undefined) params.set('soldOutInvisible', obj.soldOutInvisible.toString());

  if (obj.keywordColorId?.length) {
    params.set('keywordColorId', obj.keywordColorId.join(','));
  }
  if (obj.brandId?.length) {
    params.set('brandId', obj.brandId.join(','));
  }
  if (obj.categoryId?.length) {
    params.set('categoryId', obj.categoryId.join(','));
  }
  if (obj.subCategoryId?.length) {
    params.set('subCategoryId', obj.subCategoryId.join(','));
  }
  if (obj.size?.length) {
    params.set('size', obj.size.join(','));
  }

  return params.toString();
};

const queryStringToObject = (queryParams: IQueryParams): ISearchProductListRequest => {
  const convertedQuery: ISearchProductListRequest = {};

  if (queryParams.keyword) convertedQuery.keyword = queryParams.keyword;
  if (queryParams.gender) convertedQuery.gender = queryParams.gender;
  if (queryParams.benefit) convertedQuery.benefit = queryParams.benefit;
  if (queryParams.sort) {
    const sortValue = queryParams.sort;
    if (['latest', 'popular', 'price_high', 'price_low', 'likes', 'reviews'].includes(sortValue)) {
      convertedQuery.sort = sortValue;
    }
  }
  if (queryParams.cursor) convertedQuery.cursor = queryParams.cursor;
  if (queryParams.soldOutInvisible) convertedQuery.soldOutInvisible = queryParams.soldOutInvisible === 'true';
  if (queryParams.price) convertedQuery.price = queryParams.price;
  if (queryParams.discount) convertedQuery.discount = queryParams.discount;

  if (queryParams.keywordColorId) {
    convertedQuery.keywordColorId = queryParams.keywordColorId.split(',').map((id) => parseInt(id.trim()));
  }
  if (queryParams.brandId) {
    convertedQuery.brandId = queryParams.brandId.split(',').map((id) => parseInt(id.trim()));
  }
  if (queryParams.categoryId) {
    convertedQuery.categoryId = queryParams.categoryId.split(',').map((id) => parseInt(id.trim()));
  }
  if (queryParams.subCategoryId) {
    convertedQuery.subCategoryId = queryParams.subCategoryId.split(',').map((id) => parseInt(id.trim()));
  }
  if (queryParams.size) {
    convertedQuery.size = queryParams.size.split(',').map((size) => size.trim());
  }

  return convertedQuery;
};

export { objectToQueryString, queryStringToObject };
