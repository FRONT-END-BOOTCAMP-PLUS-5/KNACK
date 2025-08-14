import { ILikeRef } from '@/types/like';
import requester from '@/utils/requester';

export const likeService = {
  addLike: async (likeData: ILikeRef) => {
    const { data, error } = await requester.post(`api/likes`, likeData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  deleteLike: async (id: number) => {
    const { data, error } = await requester.delete(`api/likes`, { data: { id: id } }).catch((error) => error);

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
