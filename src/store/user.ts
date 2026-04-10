/** @format */

import { LoginService } from "@/services/login-service";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookie } from "@/layout/utils/cookie";
import { storage } from "@/layout/utils/storage";
import { decryptBySm4, encryptBySm4 } from "@/layout/utils/sm4";
import { clearAllCache } from "@/utils";
import { navigationService } from "@/layout/utils/navigation";
import { t } from "i18next";
import { message } from "@/utils/globalAntd";

// 用户信息接口
export interface UserInfo {
  id?: string | number;
  /**
   * 昵称/用户名
   */
  nickname: string;
  /**
   * 账号
   */
  loginName?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 性别
   * 0:男
   * 1:女
   * 2:未知
   */
  sex?: string;
  email?: string;
  description?: string;
  avatar?: string;
  phone?: string;
  /**
   * 状态
   * 0:正常
   * 1:禁用
   */
  status?: string;
  /**
   * 部门岗位
   */
  dept?: any;
  /**
   * 角色列表
   */
  roles?: string[] | number[];
  /**
   * 路由列表
   */
  routes?: any[];
  /**
   * 页面权限标识符列表
   */
  pages?: string[];
  /**
   * 按钮权限标识符列表
   */
  btns?: string[];
  /**
   * 接口权限标识符列表
   */
  apis?: string[];
  /**
   * 创建时间
   */
  createdAt?: string;
  updatedAt?: string;
}

// 登录信息接口
export interface LoginInfo {
  [key: string]: any; // 允许任意字符串索引
  mode: string;
  loginName?: string;
  password?: string;
  phone?: string;
  phoneCode?: string;
  emailDomain?: string;
  remember?: boolean;
}

// 注册信息接口
export interface RegisterInfo {
  [key: string]: any; // 允许任意字符串索引
  loginName: string;
  name?: string;
  phone?: string;
  password: string;
  email: string;
}

export interface UserState {
  // 用户信息
  userInfo: UserInfo | null;

  // 登录信息
  loginInfo: LoginInfo | null;

  // 登录状态
  isLogin: boolean;

  // 记住密码状态
  isRemeber: boolean;

  // token
  token: string | null;

  // 权限列表
  pages: string[];
  apis: string[];
  btns: string[];

  // 角色列表
  roles: any[];

  // 操作方法
  resetUserStore: () => void;
  login: (loginInfo: LoginInfo) => Promise<boolean>;
  logout: () => void;
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfo: (key: string, value: any) => void;
  setToken: (token: string) => void;
  getToken: () => string | undefined;
  setLoginInfo: (loginInfo: LoginInfo | null, isEncrypt?: boolean) => void;
  getLoginInfo: (isDecrypt?: boolean) => LoginInfo | null;
}
const loginService = new LoginService();

export const useUserStore = create<UserState>()(
  persist(
    (set, get): UserState => ({
      // 初始状态
      userInfo: null,
      loginInfo: null,
      isLogin: false,
      isRemeber: false,
      token: null,
      roles: [], // 角色列表
      /** 页面权限列表 */
      pages: [],
      /** 接口权限列表 */
      apis: [],
      /** 按钮权限列表 */
      btns: [],

      // 重置用户状态
      resetUserStore: () => {
        set({
          userInfo: null,
          loginInfo: null,
          isLogin: false,
          isRemeber: false,
          token: null,
          pages: [],
          apis: [],
          btns: [],
          roles: [],
        });
      },

      // 登录
      login: async (loginInfo) => {
        return new Promise<boolean>((resolve, reject) => {
          try {
            // 调用登录接口
            get().setLoginInfo(loginInfo, true);
            loginService
              .login(get().getLoginInfo(false) as LoginInfo)
              .then((response) => {
                // 登录信息，根据remember存储至 localStorage
                if (loginInfo.remember) {
                  get().setLoginInfo(loginInfo, true);
                } else {
                  get().setLoginInfo(null, true);
                }

                // 设置 token
                get().setToken(response.data);
                set({ isLogin: true, isRemeber: loginInfo.remember || false });
                resolve(true);
              })
              .catch((error) => {
                reject(error);
              });
          } catch (error) {
            reject(error);
          }
        });
      },

      // 登出
      logout: async () => {
        let token = get().getToken();
        if (!token) {
          clearAllCache();
          navigationService.replace("/login");
          return;
        }
        loginService.logout(token).then(() => {
          // 清除本地存储
          clearAllCache();
          navigationService.replace("/login");
        });
      },

      /**
       * 设置登录信息
       * @param loginInfo 登录信息
       * @param isEncrypt 是否加密
       */
      setLoginInfo: (loginInfo: LoginInfo | null, isEncrypt = true) => {
        // 登录信息加密
        if (!loginInfo) return set({ loginInfo: null });
        // 不加密
        if (!isEncrypt) return set({ loginInfo });
        // 遍历对象内所有key,逐一进行加密
        const encryptedLoginInfo = Object.keys(loginInfo).reduce((acc, key) => {
          if (typeof loginInfo[key] === "string") {
            acc[key] = encryptBySm4(loginInfo[key]);
          } else {
            acc[key] = loginInfo[key];
          }
          return acc;
        }, {} as LoginInfo);
        set({ loginInfo: encryptedLoginInfo });
      },
      /**
       * 获取登录信息
       * @param isDecrypt 是否解密
       * @returns 解密后的登录信息
       */
      getLoginInfo: (isDecrypt = true): LoginInfo | null => {
        const loginInfo = get().loginInfo;
        // 登录信息解密
        if (!loginInfo) return loginInfo;
        if (!isDecrypt) return loginInfo;
        // 遍历对象内所有key,逐一进行解密
        const decryptedLoginInfo = Object.keys(loginInfo).reduce((acc, key) => {
          if (typeof loginInfo[key] === "string") {
            try {
              // sm4 的 base64 输出是 4 的倍数，只有满足该条件才尝试解密，避免普通明文字符串导致崩溃
              if (loginInfo[key].length % 4 === 0) {
                acc[key] = decryptBySm4(loginInfo[key]);
              } else {
                acc[key] = loginInfo[key];
              }
            } catch (error) {
              // 解密失败时回退到原始内容，防止白屏崩溃
              acc[key] = loginInfo[key];
            }
          } else {
            acc[key] = loginInfo[key];
          }
          return acc;
        }, {} as LoginInfo);
        return decryptedLoginInfo;
      },

      // 存储用户信息
      setUserInfo: async (newUserInfo: UserInfo) => {
        const { userInfo } = get();
        if (userInfo) {
          const updatedUserInfo = { ...userInfo, ...newUserInfo };
          set({ userInfo: updatedUserInfo });
          set({ pages: updatedUserInfo.pages });
          set({ roles: updatedUserInfo.roles });
          set({ btns: updatedUserInfo.btns });
          set({ apis: updatedUserInfo.apis });
        } else {
          set({ userInfo: newUserInfo });
          set({ pages: newUserInfo.pages });
          set({ roles: newUserInfo.roles });
          set({ btns: newUserInfo.btns });
          set({ apis: newUserInfo.apis });
        }
      },
      /**
       * 更新用户信息,单个字段
       * @param key 字段名
       * @param value 字段值
       */
      updateUserInfo: (key: string, value: any) => {
        const { userInfo } = get();
        if (userInfo) {
          const updatedUserInfo = { ...userInfo, [key]: value };
          set({ userInfo: updatedUserInfo });
        }
      },

      // 设置 token
      setToken: (token) => {
        storage.set("authorization", token);
        cookie.set("authorization", token, {
          expires: 7,
          secure: import.meta.env.MODE === "production",
          sameSite: "strict",
        });
        set({ token });
      },

      // 获取token
      getToken: () => {
        return get().token || cookie.get("authorization");
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        loginInfo: state.loginInfo,
        userInfo: state.userInfo,
        token: state.token,
        isLogin: state.isLogin,
        isRemeber: state.isRemeber,
        pages: state.pages,
        roles: state.roles,
        btns: state.btns,
        apis: state.apis,
      }),
      onRehydrateStorage: () => (state) => {
        // 恢复状态时，确保 token 同步到 localStorage
        if (state?.token) {
          storage.set("authorization", state.token);
        }
      },
    }
  )
);
