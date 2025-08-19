import { ISearchProductListResponse } from '@/types/searchProductList';
import requester from '@/utils/requester';

export const searchProductService = {
  getSearchProductList: async (queryString: string) => {
    const { data, error } = await requester
      .get<{ result: ISearchProductListResponse }>(`/api/search${queryString ? `?${queryString}` : ''}`)
      .catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
