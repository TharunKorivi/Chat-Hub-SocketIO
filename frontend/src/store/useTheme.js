import { create } from "zustand";

export const useTheme = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "forest",

  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    set({ theme: newTheme });
  },
}));
