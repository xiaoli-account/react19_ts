/**
 * fastapi服务 角色管理相关接口路径与类型配置
 *
 * @format
 */

import type { PageParams, PageResponse } from "@/layout/types/base";

export default {
  /**
   * 分页查询角色列表
   */
  pageList: {
    path: "/system/role/list",
    method: "GET" as const,
    customTransformParams: (params: any): FastApiRoleListParams => {
      return {
        page_no: params.current || 1,
        page_size: params.size || 10,
        name: params.name,
        status: params.status,
      };
    },
    customTransformResponse: (
      data: FastApiRolePageResponse<FastApiRoleForm>
    ): PageResponse<any> => {
      const list = data?.items || [];
      return {
        list,
        total: data?.total || list.length || 0,
        current: data?.page_no || 1,
        size: data?.page_size || 10,
      };
    },
  },

  /**
   * 新增角色
   */
  create: {
    path: "/system/role/create",
    method: "POST" as const,
    customTransformParams: (data: any): FastApiRoleCreateParams => ({
      name: data.name,
      order: data.order,
      code: data.code,
      disable_flag: data.status,
      description: data.description,
    }),
  },

  /**
   * 根据ID查询详情
   */
  findById: {
    path: "/system/role/detail",
    method: "GET" as const,
    customTransformParams: (id: string | number) => ({ id }),
    customTransformResponse: (data: FastApiRoleForm): any => {
      return {
        id: data.id,
        name: data.name,
        code: data.code,
        order: data.order,
        status: data.disable_flag,
        description: data.description,
        created_time: data.created_time,
        updated_time: data.updated_time,
        menus: data.menus,
        depts: data.depts,
        data_scope: data.data_scope,
      };
    },
  },

  /**
   * 更新角色
   */
  update: {
    path: "/system/role/update",
    method: "PUT" as const,
    customTransformParams: (data: any): FastApiRoleForm => ({
      id: data.id,
      name: data.name,
      code: data.code,
      order: data.order,
      disable_flag: data.status,
      description: data.description,
      menus: data.menus,
      depts: data.depts,
      data_scope: data.data_scope,
    }),
  },

  /**
   * 删除角色
   */
  delete: {
    path: "/system/role/delete",
    method: "DELETE" as const,
    customTransformParams: (ids: number[]) => ids,
  },

  /**
   * 获取部门树结构
   */
  getDeptTree: {
    path: "/system/dept/tree",
    method: "GET" as const,
    customTransformResponse: (data: any): any => data,
  },

  /**
   * 保存角色权限设置
   */
  setPermission: {
    path: "/system/role/permission/setting",
    method: "PATCH" as const,
    customTransformParams: (data: any): FastApiRolePermissionParams => ({
      role_ids: data.role_ids,
      menu_ids: data.menu_ids,
      data_scope: data.data_scope,
      dept_ids: data.dept_ids,
    }),
  },
};

// --- 参数类型定义 ---

/**
 * 分页查询角色列表类型
 */
export type FastApiRoleListParams = {
  page_no?: number;
  page_size?: number;
  name?: string;
  status?: string;
};

/**
 * 新增角色表单类型
 */
export type FastApiRoleCreateParams = {
  name: string;
  order: number;
  code: string;
  disable_flag: string;
  description?: string;
};

/**
 * 角色表单类型
 */
export type FastApiRoleForm = {
  id?: string | number;
  name: string;
  code: string;
  order: number;
  description?: string;
  created_time?: string;
  updated_time?: string;
  menus?: any[];
  depts?: any[];
  data_scope?: number;
  del_flag?: number;
  disable_flag: string;
};

/**
 * 角色权限设置参数类型
 */
export type FastApiRolePermissionParams = {
  role_ids: number[];
  menu_ids: number[];
  data_scope: number;
  dept_ids?: number[];
};

// --- 响应类型定义 ---

export type FastApiRolePageResponse<T = any> = {
  items: T[];
  total: number;
  page_no: number;
  page_size: number;
};
