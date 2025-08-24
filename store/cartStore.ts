import { ICart } from '@/types/cart';
import { create } from 'zustand';

interface CartStore {
  storeCarts: ICart[];

  setStoreCarts: (data: ICart) => void;
  clearStoreCarts: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  storeCarts: [],

  setStoreCarts: (data: ICart) => set((state) => ({ storeCarts: [...state.storeCarts, data] })),
  clearStoreCarts: () => set({ storeCarts: [] }),
}));
