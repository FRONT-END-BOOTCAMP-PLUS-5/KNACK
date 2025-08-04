import { CartRef } from '@/types/cart';
import requester from '@/utils/requester';

export const cartService = {
  addCart: async (cartData: CartRef) => {
    const { data, error } = await requester.post(`/api/cart`, cartData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getCart: async () => {
    const { data, error } = await requester.get(`/api/cart`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
