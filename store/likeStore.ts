import { create } from 'zustand';

interface LikeStore {
  productDetailLike: number;
  productDetailBrandLike: number;

  setProductDetailLike: (num: number) => void;
  setProductDetailBrandLike: (num: number) => void;
}

export const useLikeStore = create<LikeStore>((set) => ({
  productDetailLike: 0,
  productDetailBrandLike: 0,

  setProductDetailLike: (count) => set({ productDetailLike: count }),
  setProductDetailBrandLike: (count) => set({ productDetailBrandLike: count }),
}));
