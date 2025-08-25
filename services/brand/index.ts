import { IBrandWithTagList } from '@/types/brand';
import { get } from '@/utils/requester';

export const brandService = {
  getBrands: async ({ keyword, key }: { keyword?: string; key?: string } = {}) => {
    const params = new URLSearchParams();

    if (keyword) params.append('keyword', keyword);
    if (key) params.append('key', key);

    const queryString = params.toString();
    const url = `/api/brands${queryString ? `?${queryString}` : ''}`;

    return await get<IBrandWithTagList[]>(url);
  },
};
