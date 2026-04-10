/** @format */

import { request } from "@/layout/utils/request";

/**
 * 仪表盘相关接口
 */

// 获取统计数据
export const getStatistics = (): Promise<any> => {
  return request.get("/api/dashboard/statistics");
};

// 获取最近操作
export const getRecentActions = (): Promise<any> => {
  return request.get("/api/dashboard/recent-actions");
};

// 获取系统概览
export const getSystemOverview = (): Promise<any> => {
  return request.get("/api/dashboard/overview");
};
