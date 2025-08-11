import { IUpdateUserRef } from '@/types/user';
import requester from '@/utils/requester';

export const myService = {
  updateUser: async (userData: IUpdateUserRef) => {
    const { data, error } = await requester.put(`/api/user/profile`, userData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
