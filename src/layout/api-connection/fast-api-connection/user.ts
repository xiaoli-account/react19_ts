/**
 * fastapi服务 用户管理相关接口路径与类型配置
 *
 * @format
 */

import type { PageParams, PageResponse } from "@/layout/types/base";
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
   * 分页查询用户列表
   */
  pageList: {
    path: "/system/user/list",
    method: "GET" as const,
    customTransformParams: (params: any): FastApiUserListParams => {
      return {
        page_no: params.current || 1,
        page_size: params.size || 10,
        username: params.loginName,
        name: params.nickname,
        disable_flag: params.status,
      };
    },
    customTransformResponse: (
      data: FastApiUserPageResponse<FastApiUserForm>
    ): PageResponse<any> => {
      const list = data?.items;
      return {
        list,
        total: data?.total || list.length || 0,
        current: data?.page_no || 1,
        size: data?.page_size || 10,
      };
    },
  },

  /**
   * 新增用户
   */
  create: {
    path: "/system/user/create",
    method: "POST" as const,
    customTransformParams: (data: UserInfo): FastApiUserForm => ({
      avatar: data.avatar,
      username: data.loginName,
      name: data.nickname,
      dept_id: data.dept,
      role_ids: data.roles,
      password: data.password,
      gender: data.sex,
      email: data.email,
      mobile: data.phone,
      is_superuser: false,
      disable_flag: data.status,
      description: data.description,
    }),
  },

  /**
   * 根据ID查询详情
   */
  findById: {
    path: "/system/user/detail",
    method: "GET" as const,
    customTransformParams: (id: string | number) => ({ id }),
    customTransformResponse: (data: FastApiUserForm): UserInfo => {
      return {
        id: data.id,
        avatar: data.avatar,
        loginName: data.username,
        nickname: data.name,
        dept: data.dept_id,
        roles: data.role_ids,
        password: data.password,
        sex: data.gender,
        email: data.email,
        phone: data.mobile,
        status: data.disable_flag,
        description: data.description,
        createdAt: data.created_time,
        updatedAt: data.updated_time,
      };
    },
  },

  /**
   * 更新用户
   */
  update: {
    path: "/system/user/update",
    method: "PUT" as const,
    customTransformParams: (data: UserInfo): FastApiUserForm => ({
      avatar: data.avatar,
      username: data.loginName,
      name: data.nickname,
      dept_id: data.dept,
      role_ids: data.roles,
      password: data.password,
      gender: data.sex,
      email: data.email,
      mobile: data.phone,
      is_superuser: false,
      disable_flag: data.status,
      description: data.description,
    }),
  },

  /**
   * 删除用户
   */
  batchDelete: {
    path: "/system/user/delete",
    method: "DELETE" as const,
    customTransformParams: (ids: number[]) => ids,
  },

  /**
   * 重置密码
   */
  resetPassword: {
    path: "/system/user/reset/password",
    method: "PUT" as const,
    customTransformParams: (data: any) => ({
      id: data.id,
      password: data.password,
    }),
  },
};

// --- 参数类型定义 ---

/**
 * 分页查询用户列表类型
 */
export type FastApiUserListParams = {
  page_no?: number;
  page_size?: number;
  username?: string;
  name?: string;
  disable_flag?: string;
};
/**
 * 新增用户表单类型
 */
export type FastApiUserForm = {
  id?: string | number;
  avatar?: string;
  username?: string;
  name: string;
  dept_id?: number | string;
  role_ids?: number[] | string[];
  password?: string;
  gender?: string;
  email?: string;
  mobile?: string;
  is_superuser: boolean;
  disable_flag?: string | undefined;
  description?: string;
  updated_time?: string;
  created_id?: string | number;
  updated_id?: string | number;
  created_time?: string;
  created_by?: object;
  updated_by?: object;
  del_flag?: string;
  dept?: object;
  dept_name?: string;
  menus?: string[];
  roles?: string[];
  position_ids?: string[];
  positions?: string[];
};

/**
 * 更新密码表单类型
 */
export type FastApiUpdatePasswordParams = {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

// --- 响应类型定义 ---

export type FastApiUserPageResponse<T = any> = {
  items: T[];
  total: number;
  page_no: number;
  page_size: number;
};
