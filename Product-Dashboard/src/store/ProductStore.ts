import { create } from "zustand";
import type { Product } from "../types/Product";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];

  currentPage: number;
  itemsPerPage: number;

  setProducts: (products: Product[]) => void;
  search: (term: string) => void;
  filterByCategory: (category: string) => void;
  sortByPrice: (order: "asc" | "desc" | "default") => void;
  setPage: (page: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],

  currentPage: 1,
  itemsPerPage: 6,

  setProducts: (products) => {
    const categories = Array.from(new Set(products.map((p) => p.category)));

    set({
      products,
      filteredProducts: products,
      categories,
    });
  },

  search: (term) => {
    const all = get().products;
    set({
      filteredProducts: all.filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.category.toLowerCase().includes(term.toLowerCase()),
      ),
      currentPage: 1,
    });
  },

  filterByCategory: (category) => {
    const all = get().products;
    set({
      filteredProducts:
        category === "all" ? all : all.filter((p) => p.category === category),
      currentPage: 1,
    });
  },

  sortByPrice: (order) => {
    if (order === "default") {
      set({ filteredProducts: get().products });
      return;
    }
    const sorted = [...get().filteredProducts].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price,
    );
    set({ filteredProducts: sorted });
  },

  setPage: (page) => set({ currentPage: page }),
}));
