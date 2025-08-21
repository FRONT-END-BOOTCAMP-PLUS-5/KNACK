import { IPageCategory } from '@/types/category';
import { get } from '@/utils/requester';

export const categoryService = {
  getCategories: async () => {
    return await get<IPageCategory[]>(`/api/categories`);
  },
};
