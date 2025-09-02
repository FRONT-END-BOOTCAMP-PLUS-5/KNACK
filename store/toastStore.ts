import { create } from 'zustand';

interface ToastStore {
  onToast: { open: boolean; message: string; link?: string };

  setOnToast: (open: boolean, message: string, link?: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  onToast: { open: false, message: '' },

  setOnToast: (open, message, link?) => {
    set({ onToast: { open, message, link } });
  },
}));
