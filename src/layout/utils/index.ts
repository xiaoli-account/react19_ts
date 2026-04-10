/** @format */

import { useUserStore } from "@/store/user";

/**
 * 获取SSO Token
 * 方式一、URL参数
 * 方式二、Cookie
 * @returns
 */
export const getSSOToken = () => {
  try {
    // 方式一、URL参数
    const urlToken = new URLSearchParams(window.location.search).get(
      "authorization"
    );
    if (urlToken) return urlToken;

    // 方式二、Cookie (通过 Store 获取)
    const cookieToken = useUserStore.getState().getToken();
    if (cookieToken) return cookieToken;
  } catch (error) {
    // 方式三、Cookie (通过 Cookie 获取) 降级方案，容错处理
    const cookie = document.cookie
      .split(";")
      .find((cookie) => cookie.startsWith("authorization="));
    if (cookie) return cookie.split("=")[1];
  }

  // 如果以上方式都未找到 Token，返回 null
  return null;
};
