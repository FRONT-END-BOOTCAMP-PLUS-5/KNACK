import requester from '@/utils/requester';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { objectToQueryString } from '@/utils/queryString';

export const filterCountsService = {
  getFilterCounts: async (filters: ISearchProductListRequest) => {
    const queryString = objectToQueryString(filters);
    const url = `/api/search/filter-counts${queryString ? `?${queryString}` : ''}`;

    const { data, error } = await requester.get(url).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
