/** @format */

import { create } from "zustand";
import type { RouteItem } from "@/layout/router/router-type";
import { LeeLogger } from "../utils/leeLogger";
import { useMenuStore } from "./menu-store";

/**
 * 路由状态接口
 */
export interface RouterState {
  /**
   * 当前路由配置
   */
  routes: RouteItem[];

  /**
   * 更新路由配置
   * @param newRoutes - 新的路由配置
   */
  setRoutes: (newRoutes: RouteItem[]) => void;
  /**
   * 获取路由配置
   */
  getRoutes: () => RouteItem[];

  /**
   * 重置为默认路由配置
   */
  resetRoutes: (routes: RouteItem[]) => void;
}

/**
 * 路由状态管理 Store
 *
 * 用于管理应用的动态路由配置，支持：
 * - 存储当前路由配置
 * - 更新路由配置（用于动态路由）
 * - 重置为默认配置
 * - ⚠️ 路由数据禁止持久化，会导致react路由配置对象组件渲染失败,
 * 参考src/layout/router/index.tsx #L182-197 处理方式实现相同效果
 */
export const useRouterStore = create<RouterState>((set, get) => ({
  // 初始路由配置
  routes: [],

  // 更新路由配置
  setRoutes: (newRoutes: RouteItem[]) => {
    LeeLogger.info("更新路由配置", newRoutes);
    set({ routes: newRoutes });
    // 更新菜单数据
    useMenuStore.getState().setRoutesMenu(newRoutes);
  },
  // 获取路由配置
  getRoutes: () => {
    return get().routes;
  },
  // 重置路由配置
  resetRoutes: (routes: RouteItem[]) => {
    LeeLogger.info("重置路由配置", routes);
    set({ routes: routes });
  },
}));
