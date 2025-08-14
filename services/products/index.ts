import { IProduct } from '@/types/productDetail';
import requester from '@/utils/requester';

export const productsService = {
  getProduct: async (id: number) => {
    const { data, error } = await requester.get<{ result: IProduct }>(`/api/products/${id}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data.result;
  },

  getProductList: async (ids: string) => {
    const { data, error } = await requester.get(`api/products?${ids}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getRecentlyProductList: async (id: string) => {
    const { data, error } = await requester.get(`api/products/recent?${id}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
