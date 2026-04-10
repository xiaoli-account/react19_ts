/** @format */

import { useLayoutStore } from "../stores/layout-store";

/**
 * 布局 Hook
 */
export const useLayout = () => {
  const {
    layoutMode,
    sidebarCollapsed,
    setLayoutMode,
    toggleSidebar,
    setSidebarCollapsed,
  } = useLayoutStore();

  return {
    layoutMode,
    sidebarCollapsed,
    setLayoutMode,
    toggleSidebar,
    setSidebarCollapsed,
    isBasicLayout: layoutMode === "lee-basic",
    isSidebarLayout: layoutMode === "lee-sidebar",
    isTopMenuLayout: layoutMode === "lee-top-menu",
  };
};
