import { ICart } from '@/types/cart';
import { create } from 'zustand';

interface CartStore {
  cart: ICart[];

  setCart: (cart: ICart) => void;
  updateCart: (updates: ICart) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  setCart: (newCart) =>
    set((state) => {
      cart: [...state.cart, newCart];
    }),

  updateCart: (updates) =>
    set((state) => ({
      cart: state.cart ? { ...state.cart, ...updates } : [],
    })),
}));
