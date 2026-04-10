/** @format */

import { useUserStore } from "@/store";

/**
 * 用户认证 Hook
 */
export const useAuth = () => {
  const { userInfo, isLogin, login, logout } = useUserStore();

  return {
    userInfo,
    isLogin,
    login,
    logout,
    isAuthenticated: isLogin && !!userInfo,
  };
};
