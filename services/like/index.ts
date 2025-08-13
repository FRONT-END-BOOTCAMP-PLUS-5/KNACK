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

  getLikes: async (ids: string) => {
    const { data, error } = await requester.get(`api/likes?${ids}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
