import { ISearchProductListResponse } from '@/types/searchProductList';
import { get } from '@/utils/requester';

export const searchProductService = {
  getSearchProductList: async (queryString: string) => {
    return await get<ISearchProductListResponse>(`/api/search${queryString ? `?${queryString}` : ''}`);
  },

  getSearchProductListSSR: async (
    queryString: string,
    sessionToken?: string,
    csrfToken?: string
  ): Promise<ISearchProductListResponse> => {
    const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000';
    const url = `${baseURL}/api/search${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken && { Cookie: `next-auth.session-token=${sessionToken}` }),
        ...(csrfToken && { 'x-csrf-token': csrfToken }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
