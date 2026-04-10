/**
 * fastapi服务 用户管理相关接口路径与类型配置
 *
 * @format
 */

import type { UserInfo } from "@/store/user";

export default {
  /**
   * 获取登录用户信息
   */
  getUserInfo: {
    path: "/getUserInfo",
    method: "GET" as const,
    customTransformResponse: (data: any): UserInfo => {
      return data;
    },
  },
  /**
   * 密码校验
   */
  validateUserPassword: {
    path: "/user/validateUserPassword",
    method: "POST" as const,
    customTransformParams: (data: any) => ({
      password: data.password,
    }),
  },
  /**
   * 更新密码
   */
  updatePassword: {
    path: "/user/updatePassword",
    method: "POST" as const,
    customTransformParams: (data: any): FastApiUpdatePasswordParams => ({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }),
  },
  /**
   * 根据ID查找用户
   */
  findUserById: {
    path: "/user/findUserById",
    method: "GET" as const,
    customTransformParams: (id: string) => ({ id }),
    customTransformResponse: (data: any): UserInfo => data,
  },
  /**
   * 更新用户信息
   */
  update: {
    path: "/user/update",
    method: "POST" as const,
    customTransformParams: (data: UserInfo): FastApiUserSaveParams => ({
      id: data.id,
      loginName: data.loginName || "",
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      roles: data.roles,
    }),
  },
  /**
   * 分页获取用户列表
   */
  pageList: {
    path: "/user/pageList",
    method: "GET" as const,
    customTransformParams: (data: any): FastApiUserPageParams => ({
      current: data.current,
      size: data.size,
      nickname: data.nickname,
      loginName: data.loginName,
      status: data.status,
    }),
    customTransformResponse: (data: FastApiUserPageResponse) => ({
      list: data.records,
      total: data.total,
      current: data.current,
      size: data.size,
    }),
  },
  /**
   * 保存或更新用户
   */
  saveOrUpdateUser: {
    path: "/user/saveOrUpdateUser",
    method: "POST" as const,
    customTransformParams: (data: any): FastApiUserSaveParams => ({
      id: data.id,
      loginName: data.loginName,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      roles: data.roles,
      status: data.status,
    }),
  },
  /**
   * 级联删除用户
   */
  deleteUserCascade: {
    path: "/user/deleteUserCascade",
    method: "POST" as const,
    customTransformParams: (id: string) => ({ id }),
  },
};

// --- 参数类型定义 ---

export type FastApiUserPageParams = {
  current?: number;
  size?: number;
  nickname?: string;
  loginName?: string;
  status?: number;
};

export type FastApiUserSaveParams = {
  id?: string;
  loginName: string;
  nickname: string;
  email?: string;
  phone?: string;
  roles: string[];
  status?: number;
};

export type FastApiUpdatePasswordParams = {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

// --- 响应类型定义 ---

export type FastApiUserPageResponse = {
  records: any[];
  total: number;
  current: number;
  size: number;
};
