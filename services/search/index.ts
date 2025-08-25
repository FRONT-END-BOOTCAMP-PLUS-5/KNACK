import { ISearchProductListResponse } from '@/types/searchProductList';
import { get } from '@/utils/requester';

export const searchProductService = {
  getSearchProductList: async (queryString: string, userId?: string) => {
    return await get<ISearchProductListResponse>(
      `/api/search${queryString ? `?${queryString}` : ''}`,
      undefined,
      userId
    );
  },
};
