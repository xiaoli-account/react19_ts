/** @format */

/**
 * 分页参数类型
 */
export interface PageParams {
  current?: number;
  size?: number;
}

/**
 * 分页响应类型
 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  current: number;
  size: number;
}
