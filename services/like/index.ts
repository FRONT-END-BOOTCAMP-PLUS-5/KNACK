import { ILikeRef } from '@/types/like';
import requester from '@/utils/requester';

export const likeService = {
  addLike: async (likeData: ILikeRef) => {
    const { data, error } = await requester.post(`api/likes`, likeData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
