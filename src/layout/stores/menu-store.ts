/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LeeLogger } from "../utils/leeLogger";

interface MenuState {
  // 菜单展开状态
  openKeys: string[];
  // 最后选中的菜单项
  selectedKeys: string[];
  // 设置展开状态
  setOpenKeys: (keys: string[]) => void;
  // 设置选中状态
  setSelectedKeys: (keys: string[]) => void;
  // 重置菜单状态
  resetMenuState: () => void;
  // 菜单数据-仅为菜单组件构建时使用，并非实际路由配置请勿混淆
  routesMenu: any;
  // 设置菜单数据
  setRoutesMenu: (routesMenu: any) => void;
  // 获取菜单数据
  getRoutesMenu: () => any;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      openKeys: [],
      selectedKeys: [],
      routesMenu: [],

      setOpenKeys: (keys: string[]) => set({ openKeys: keys }),
      setSelectedKeys: (keys: string[]) => {
        set({ selectedKeys: keys });
        LeeLogger.info("用户进入【" + keys.join(",") + "】菜单", keys);
      },
      resetMenuState: () => set({ openKeys: [], selectedKeys: [] }),

      setRoutesMenu: (routesMenu: any) => {
        set({ routesMenu: routesMenu });
        LeeLogger.info("设置菜单路由数据", routesMenu);
      },
      getRoutesMenu: () => get().routesMenu,
    }),
    {
      name: "layout-menu-storage", // localStorage key
      partialize: (state) => ({
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys,
        routesMenu: state.routesMenu,
      }),
    }
  )
);
