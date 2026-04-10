/**
 * fastapi 服务 字典管理相关接口路径与类型配置
 *
 * @format
 */

import type { PageParams, PageResponse } from "@/layout/types/base";

export default {
  /**
   * 分页查询字典类型列表
   */
  pageList: {
    path: "/system/dict/type/list",
    method: "GET" as const,
    customTransformParams: (params: any): FastApiDictTypeListParams => {
      return {
        page_no: params.current || 1,
        page_size: params.size || 10,
        dict_name: params.dict_name,
        dict_type: params.dict_type,
        disable_flag: params.disable_flag,
        created_time: params.created_time || [],
      };
    },
    customTransformResponse: (
      data: FastApiDictTypePageResponse<FastApiDictTypeForm>
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
   * 新增字典类型
   */
  createType: {
    path: "/system/dict/type/create",
    method: "POST" as const,
    customTransformParams: (data: any): FastApiDictTypeCreateParams => ({
      dict_name: data.dict_name,
      dict_type: data.dict_type,
      disable_flag: data.status,
      description: data.description,
    }),
  },

  /**
   * 更新字典类型
   */
  updateType: {
    path: "/system/dict/type/update",
    method: "PUT" as const,
    customTransformParams: (data: any): FastApiDictTypeForm => ({
      id: data.id,
      dict_name: data.dict_name,
      dict_type: data.dict_type,
      disable_flag: data.status,
      description: data.description,
      del_flag: data.del_flag,
      created_time: data.created_time,
      updated_time: data.updated_time,
    }),
  },

  /**
   * 根据 ID 查询字典类型详情
   */
  findTypeById: {
    path: "/system/dict/type/detail",
    method: "GET" as const,
    customTransformParams: (id: string | number) => ({ id }),
    customTransformResponse: (data: FastApiDictTypeForm): any => {
      return {
        id: data.id,
        dict_name: data.dict_name,
        dict_type: data.dict_type,
        status: data.disable_flag,
        description: data.description,
        disable_flag: data.disable_flag,
        del_flag: data.del_flag,
        created_time: data.created_time,
        updated_time: data.updated_time,
      };
    },
  },

  /**
   * 删除字典类型
   */
  deleteType: {
    path: "/system/dict/type/delete",
    method: "DELETE" as const,
    customTransformParams: (ids: number[]) => ids,
  },
};

// --- 参数类型定义 ---

/**
 * 分页查询字典类型列表参数
 */
export type FastApiDictTypeListParams = {
  page_no?: number;
  page_size?: number;
  dict_name?: string;
  dict_type?: string;
  disable_flag?: string;
  created_time?: string[];
};

/**
 * 新增字典类型参数
 */
export type FastApiDictTypeCreateParams = {
  dict_name: string;
  dict_type: string;
  disable_flag: string;
  description?: string;
};

/**
 * 字典类型表单类型
 */
export type FastApiDictTypeForm = {
  id?: string | number;
  dict_name: string;
  dict_type: string;
  description?: string;
  disable_flag?: string;
  del_flag?: number;
  created_time?: string;
  updated_time?: string;
};

// --- 响应类型定义 ---

export type FastApiDictTypePageResponse<T = any> = {
  items: T[];
  total: number;
  page_no: number;
  page_size: number;
};
