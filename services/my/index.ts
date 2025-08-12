import { IAddressList, IAddressRef, IUpdateAddress } from '@/types/address';
import { IUpdateUserRef } from '@/types/user';
import requester from '@/utils/requester';

export const myService = {
  updateUser: async (userData: IUpdateUserRef) => {
    const { data, error } = await requester.put(`/api/user/profile`, userData).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },

  getAddress: async () => {
    const { data, error } = await requester.get(`/api/addresses`).catch((error) => error);

    if (error) throw new Error(error.message);

    return {
      result: data,
    };
  },

  addAddress: async (addressData: IAddressRef) => {
    const { data, error } = await requester.post(`/api/addresses`, addressData).catch((error) => error);

    if (error) throw new Error(error.message);

    return {
      result: data,
    };
  },

  updateAddress: async (addressData: IUpdateAddress) => {
    const { data, error } = await requester
      .put(`/api/addresses/${addressData?.id}`, addressData)
      .catch((error) => error);

    if (error) throw new Error(error.message);

    return {
      result: data,
    };
  },

  deleteAddress: async (id: number) => {
    const { data, error } = await requester.delete(`api/addresses/${id}`).catch((error) => error);

    if (error) throw new Error(error.message);

    return {
      result: data,
    };
  },
};
