/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
  // 页面加载状态
  loading: boolean;

  // 操作方法
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      loading: false,

      // 设置加载状态
      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: "app-storage", // 存储键名
      partialize: () => ({}), // 不持久化状态，只保留在内存中
    }
  )
);
