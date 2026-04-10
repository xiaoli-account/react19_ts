/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LeeLogger } from "../utils/leeLogger";

export interface LayoutState {
  layoutMode: "lee-basic" | "lee-sidebar" | "lee-top-menu" | "lee-plm";
  sidebarCollapsed: boolean;
  setLayoutMode: (
    mode: "lee-basic" | "lee-sidebar" | "lee-top-menu" | "lee-plm"
  ) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      layoutMode: "lee-basic",
      sidebarCollapsed: false,

      setLayoutMode: (layoutMode) => {
        set({ layoutMode });
        LeeLogger.info("用户点击切换布局模式按钮", layoutMode);
      },

      toggleSidebar: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: "layout-storage",
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
