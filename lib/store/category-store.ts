import { create } from 'zustand';
import { Category } from '../types/todo';

interface CategoryStore {
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, name: string) => void;
  reorderCategories: (newCategories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [
    { id: '1', name: '할일', createdAt: new Date() },
    { id: '2', name: '설치', createdAt: new Date() },
    { id: '3', name: '세무관련', createdAt: new Date() },
  ],

  addCategory: (name: string) => {
    set((state) => ({
      categories: [
        ...state.categories,
        {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date(),
        },
      ],
    }));
  },

  deleteCategory: (id: string) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },

  updateCategory: (id: string, name: string) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, name } : category
      ),
    }));
  },

  reorderCategories: (newCategories: Category[]) => {
    set(() => ({
      categories: newCategories,
    }));
  },
}));
