import { ICart } from '@/types/cart';
import { create } from 'zustand';

interface CartStore {
  storeCarts: ICart[];
  setStoreCarts: (data: ICart) => void;
  removeStoreCarts: (idsToRemove: number[]) => void;
  clearStoreCarts: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  storeCarts: [],
  setStoreCarts: (data: ICart) => set((state) => ({ storeCarts: [...state.storeCarts, data] })),
  removeStoreCarts: (idsToRemove: number[]) => set((state) => ({
    storeCarts: state.storeCarts.filter(c => !idsToRemove.includes(c.id))
  })),
  clearStoreCarts: () => set({ storeCarts: [] }),
}));
