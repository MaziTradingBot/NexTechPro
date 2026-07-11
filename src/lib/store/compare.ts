"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean; // returns true if now in compare
  remove: (id: string) => void;
  clear: () => void;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return false;
        }
        set({ ids: [...ids, id].slice(-MAX_COMPARE) });
        return true;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "nextech-compare" },
  ),
);
