/** @format */

import { request } from "@/layout/utils/request";
import type {
  User,
  UserListParams,
  UserListResponse,
  UserFormData,
} from "./types";

/**
 * 获取用户列表
 */
export const getUserList = (params: UserListParams) => {
  return request.get<UserListResponse>("/api/users", { params });
};

/**
 * 获取用户详情
 */
export const getUserById = (id: string) => {
  return request.get<User>(`/api/users/${id}`);
};

/**
 * 创建用户
 */
export const createUser = (data: UserFormData) => {
  return request.post<User>("/api/users", data);
};

/**
 * 更新用户
 */
export const updateUser = (id: string, data: Partial<UserFormData>) => {
  return request.put<User>(`/api/users/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = (id: string) => {
  return request.delete(`/api/users/${id}`);
};

/**
 * 批量删除用户
 */
export const batchDeleteUsers = (ids: string[]) => {
  return request.post("/api/users/batch-delete", { ids });
};
