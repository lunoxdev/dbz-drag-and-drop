import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Item } from "../types";

interface CharStore {
  characters: Item[];
  setCharacters: (items: Item[]) => void;
}

export const useCharStore = create<CharStore>()(
  persist(
    (set) => ({
      characters: [],
      setCharacters: (items) => set({ characters: items }),
    }),
    {
      name: "char-storage",
    }
  )
);
