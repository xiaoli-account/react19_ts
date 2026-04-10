/**
 * Cookie 工具 - 基于 js-cookie
 *
 * // 基本使用
 * import { cookie } from '@/utils/cookie';
 *
 * // 设置 Cookie
 * cookie.set('token', 'abc123', { expires: 7 });
 *
 * // 获取 Cookie
 * const token = cookie.get('token');
 *
 * // 删除 Cookie
 * cookie.remove('token');
 *
 * // 获取所有 Cookie
 * const allCookies = cookie.getAll();
 *
 * // 清空所有 Cookie
 * cookie.clear();
 * ```
 *
 * // 高级配置
 * import { cookie, CookieOptions } from '@/utils/cookie';
 *
 * const options: CookieOptions = {
 *   expires: 30,
 *   path: '/admin',
 *   domain: '.example.com',
 *   secure: true,
 *   sameSite: 'strict'
 * };
 *
 * cookie.set('session', 'xyz789', options);
 * ```
 *
 * // 向后兼容的函数名
 * import { setCookie, getCookie, removeCookie } from '@/utils/cookie';
 *
 * setCookie('user', 'john', 7);
 * const user = getCookie('user');
 * removeCookie('user');
 * ```
 *
 * @format
 * @example ```typescript
 * @example ```typescript
 * @example ```typescript
 */

import Cookies from "js-cookie";

// Cookie 操作选项
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Cookie 工具类
 */
export const cookie = {
  /**
   * 设置 Cookie
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param options 选项配置
   */
  set: (name: string, value: string, options?: CookieOptions): void => {
    Cookies.set(name, value, {
      expires: options?.expires || 7,
      path: options?.path || "/",
      domain: options?.domain || import.meta.env.VITE_APP_COOKIE_DOMAIN,
      secure: options?.secure || import.meta.env.MODE === "production",
      sameSite: options?.sameSite || "strict",
    });
  },

  /**
   * 获取 Cookie
   * @param name Cookie 名称
   * @returns Cookie 值
   */
  get: (name: string): string | undefined => {
    return Cookies.get(name);
  },

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   * @param options 选项配置
   */
  remove: (
    name: string,
    options?: Pick<CookieOptions, "path" | "domain">
  ): void => {
    Cookies.remove(name, {
      path: options?.path || "/",
      domain: options?.domain,
    });
  },

  /**
   * 获取所有 Cookie
   * @returns 所有 Cookie 对象
   */
  getAll: (): Record<string, string> => {
    return Cookies.get();
  },

  /**
   * 清除所有 Cookie
   */
  clear: (): void => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((name) => {
      Cookies.remove(name);
    });
  },
};

// 导出兼容的函数名（向后兼容）
export const setCookie = cookie.set;
export const getCookie = cookie.get;
export const removeCookie = cookie.remove;
export const getAllCookies = cookie.getAll;
