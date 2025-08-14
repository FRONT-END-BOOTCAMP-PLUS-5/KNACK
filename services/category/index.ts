import requester from '@/utils/requester';

export const categoryService = {
  getCategories: async () => {
    const { data, error } = await requester.get(`/api/categories`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
