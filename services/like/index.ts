import requester from '@/utils/requester';

export const likeService = {
  addLike: async (productId: number) => {
    const { data, error } = await requester.post(`api/likes`, { productId }).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  deleteLike: async (productId: number) => {
    const { data, error } = await requester.delete(`api/likes`, { data: { id: productId } }).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getLikes: async () => {
    const { data, error } = await requester.get(`api/likes`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  addBrandLike: async (id: number) => {
    const { data, error } = await requester.post(`api/brand-likes`, { id: id }).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  deleteBrandLike: async (id: number) => {
    const { data, error } = await requester.delete(`api/brand-likes`, { data: { id: id } }).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getBrandLikes: async () => {
    const { data, error } = await requester.get(`api/brand-likes`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
