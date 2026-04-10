/**
 * fastapi 服务 字典数据相关接口路径与类型配置
 *
 * @format
 */

import type { PageParams, PageResponse } from "@/layout/types/base";

export default {
  /**
   * 分页查询字典数据列表
   */
  pageList: {
    path: "/system/dict/data/list",
    method: "GET" as const,
    customTransformParams: (params: any): FastApiDictDataListParams => {
      return {
        page_no: params.current || 1,
        page_size: params.size || 10,
        dict_label: params.dict_label,
        dict_type: params.dict_type,
        disable_flag: params.status,
        created_time: params.created_time,
      };
    },
    customTransformResponse: (
      data: FastApiDictDataPageResponse<FastApiDictDataForm>
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
   * 新增字典数据
   */
  create: {
    path: "/system/dict/data/create",
    method: "POST" as const,
    customTransformParams: (data: any): FastApiDictDataCreateParams => ({
      dict_sort: data.dict_sort ?? 0,
      dict_label: data.dict_label,
      dict_value: data.dict_value,
      dict_type: data.dict_type,
      css_class: data.css_class ?? "",
      is_default: data.is_default ?? false,
      disable_flag: data.disable_flag ?? "0",
      description: data.description,
      dict_type_id: data.dict_type_id,
    }),
  },

  /**
   * 根据 ID 查询字典数据详情
   */
  findById: {
    path: "/system/dict/data/detail",
    method: "GET" as const,
    customTransformParams: (id: string | number) => ({ id }),
    customTransformResponse: (data: FastApiDictDataForm): any => {
      return {
        id: data.id,
        dict_sort: data.dict_sort,
        dict_label: data.dict_label,
        dict_value: data.dict_value,
        dict_type: data.dict_type,
        css_class: data.css_class,
        list_class: data.list_class,
        is_default: data.is_default,
        disable_flag: data.disable_flag,
        description: data.description,
        dict_type_id: data.dict_type_id,
        del_flag: data.del_flag,
        created_time: data.created_time,
        updated_time: data.updated_time,
      };
    },
  },

  /**
   * 更新字典数据
   */
  update: {
    path: "/system/dict/data/update",
    method: "PUT" as const,
    customTransformParams: (data: any): FastApiDictDataForm => ({
      id: data.id,
      dict_sort: data.dict_sort,
      dict_label: data.dict_label,
      dict_value: data.dict_value,
      dict_type: data.dict_type,
      css_class: data.css_class,
      list_class: data.list_class,
      is_default: data.is_default,
      disable_flag: data.disable_flag,
      description: data.description,
      dict_type_id: data.dict_type_id,
      del_flag: data.del_flag,
      created_time: data.created_time,
      updated_time: data.updated_time,
    }),
  },

  /**
   * 删除字典数据
   */
  delete: {
    path: "/system/dict/data/delete",
    method: "DELETE" as const,
    customTransformParams: (ids: number[]) => ids,
  },
};

// --- 参数类型定义 ---

/**
 * 分页查询字典数据列表参数
 */
export type FastApiDictDataListParams = {
  page_no?: number;
  page_size?: number;
  dict_label?: string;
  dict_type?: string;
  disable_flag?: string;
  created_time?: string;
};

/**
 * 新增字典数据参数
 */
export type FastApiDictDataCreateParams = {
  dict_sort: number;
  dict_label: string;
  dict_value: string;
  dict_type: string;
  css_class?: string;
  is_default: boolean;
  disable_flag: string;
  description?: string;
  dict_type_id: number;
};

/**
 * 字典数据表单类型
 */
export type FastApiDictDataForm = {
  id?: string | number;
  dict_sort: number;
  dict_label: string;
  dict_value: string;
  dict_type: string;
  css_class?: string;
  list_class?: string | null;
  is_default: boolean;
  description?: string;
  dict_type_id: number;
  disable_flag?: string;
  del_flag?: number;
  created_time?: string;
  updated_time?: string;
};

// --- 响应类型定义 ---

export type FastApiDictDataPageResponse<T = any> = {
  items: T[];
  total: number;
  page_no: number;
  page_size: number;
};
