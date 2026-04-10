/** @format */

// 用户信息类型
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// 用户列表查询参数
export interface UserListParams {
  page: number;
  pageSize: number;
  username?: string;
  email?: string;
  role?: string;
  status?: "active" | "inactive";
}

// 用户列表响应
export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}

// 创建/更新用户参数
export interface UserFormData {
  username: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  password?: string;
}

// 角色选项
export const ROLE_OPTIONS = [
  { label: "管理员", value: "admin" },
  { label: "普通用户", value: "user" },
  { label: "访客", value: "guest" },
];

// 状态选项
export const STATUS_OPTIONS = [
  { label: "启用", value: "active" },
  { label: "禁用", value: "inactive" },
];
