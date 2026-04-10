/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",

      setTheme: (theme) => {
        set({ theme });
        // 更新 DOM 属性
        document.documentElement.setAttribute("data-theme", theme);
      },
    }),
    {
      name: "layout-theme-storage",
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // 页面刷新后，从持久化数据恢复时应用主题
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
