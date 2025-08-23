import { create } from 'zustand';

interface LikeStore {
  productDetailLike: { count: number; status: boolean };
  productDetailBrandLike: { count: number; status: boolean };

  setProductDetailLike: (num: number, status: boolean) => void;
  setProductDetailBrandLike: (num: number, status: boolean) => void;
}

export const useLikeStore = create<LikeStore>((set) => ({
  productDetailLike: { count: 0, status: false },
  productDetailBrandLike: { count: 0, status: false },

  setProductDetailLike: (count, status) => {
    set({ productDetailLike: { count: count, status: status } });
  },
  setProductDetailBrandLike: (count, status) => set({ productDetailBrandLike: { count: count, status: status } }),
}));
