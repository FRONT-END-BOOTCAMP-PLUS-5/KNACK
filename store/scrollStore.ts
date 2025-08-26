import { create } from 'zustand';

export interface ScrollHeight {
  detailImage?: number;
  review?: number;
  recommend?: number;
}

interface ScrollStore {
  shouldScrollToMove: boolean;
  scrollHeight: ScrollHeight;
  scrollType: keyof ScrollHeight;

  setScrollToMove: (status: boolean) => void;
  setScrollHeight: (height: number, type: keyof ScrollHeight) => void;
  setScrollType: (type: keyof ScrollHeight) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  shouldScrollToMove: false,
  scrollType: 'detailImage',
  scrollHeight: {
    detailImage: 0,
    recommend: 0,
    review: 0,
  },

  setScrollToMove: (status) => set({ shouldScrollToMove: status }),
  setScrollHeight: (height, type) => {
    set((state) => ({ scrollHeight: { ...state.scrollHeight, [type]: height } }));
  },

  setScrollType: (type) => set({ scrollType: type }),
}));
