import { CartRef, ICart } from '@/types/cart';
import requester from '@/utils/requester';

export const cartService = {
  upsertCart: async (cartData: CartRef | ICart) => {
    const { data, error } = await requester.post(`/api/cart`, cartData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getCart: async () => {
    const { data, error } = await requester.get(`/api/cart`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  removeCart: async (id: number) => {
    const { data, error } = await requester.delete(`/api/cart?id=${id}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  removesCart: async (ids: number[]) => {
    const { data, error } = await requester.post(`/api/cart/deletes`, { ids: ids }).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
