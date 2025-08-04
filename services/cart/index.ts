import requester from '@/utils/requester';

export const cartService = {
  getChatRoom: async (cartData) => {
    const { data, error } = await requester.post(`/api/cart`, cartData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data.chatRoom;
  },
};
