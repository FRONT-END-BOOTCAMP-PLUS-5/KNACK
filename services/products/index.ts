import { IProduct } from '@/types/productDetail';
import { get } from '@/utils/requester';

export const productsService = {
  getProduct: async (id: number) => {
    const { result, error } = await get<{ result: IProduct }>(`/api/products/${id}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return result;
  },
};
