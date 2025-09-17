import requester from '@/utils/requester';

export const couponService = {
  deleteCoupon: async (id: number) => {
    return await requester.delete(`api/coupon?id=${id}`);
  },
};
