"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 12;

interface RecentlyViewedState {
  ids: string[]; // most-recent first
  add: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const ids = get().ids.filter((x) => x !== id);
        set({ ids: [id, ...ids].slice(0, MAX) });
      },
      clear: () => set({ ids: [] }),
    }),
    { name: "nextech-viewed" },
  ),
);
