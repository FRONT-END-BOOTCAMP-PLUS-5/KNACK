import { IPageCategory } from '@/types/category';
import { create } from 'zustand';

interface CategoryStore {
  categories: IPageCategory[];
  setCategories: (categories: IPageCategory[]) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));
