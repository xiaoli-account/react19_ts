/** @format */

import { storage, sessionStorage } from "../layout/utils/storage";
import { cookie } from "../layout/utils/cookie";
import { useUserStore } from "../store/user";
import { useMenuStore } from "@/layout/stores/menu-store";

/**
 * 清除全部缓存
 */
export function clearAllCache() {
  // 在非 React 组件中调用 Zustand store，需要使用 getState()
  // 重置用户状态
  useUserStore.getState().resetUserStore();
  // 重置菜单状态
  useMenuStore.getState().resetMenuState();
  localStorage.clear(); // 必须清除原生 localStorage，因为 Zustand persist 默认使用它
  // 清除 localforage
  storage.clear();
  sessionStorage.clear();
  cookie.clear();
}
