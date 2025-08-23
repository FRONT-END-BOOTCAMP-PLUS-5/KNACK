import { ISearchProductListResponse } from '@/types/searchProductList';
import { get, getSSR } from '@/utils/requester';

export const searchProductService = {
  getSearchProductList: async (queryString: string) => {
    return await get<ISearchProductListResponse>(`/api/search${queryString ? `?${queryString}` : ''}`);
  },

  getSearchProductListSSR: async (
    queryString: string,
    sessionToken?: string,
    csrfToken?: string
  ): Promise<ISearchProductListResponse> => {
    return await getSSR<ISearchProductListResponse>(
      `/api/search${queryString ? `?${queryString}` : ''}`,
      sessionToken,
      csrfToken
    );
  },
};
