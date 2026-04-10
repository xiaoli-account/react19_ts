/**
 * fastapi服务 公告告警相关接口路径与类型配置
 *
 * @format
 */

export default {
  /**
   * 获取通知公告分页列表
   */
  pageList: {
    path: "/notice/list",
    method: "GET" as const,
    customTransformParams: (params: any) => ({
      current: params.current,
      size: params.size,
      ...params,
    }),
    customTransformResponse: (data: any) => ({
      list: data.records,
      total: data.total,
      current: data.current,
      size: data.size,
    }),
  },

  /**
   * 新增通知公告
   */
  add: {
    path: "/notice/add",
    method: "POST" as const,
    customTransformParams: (data: any) => data,
  },

  /**
   * 更新通知公告
   */
  update: {
    path: "/notice/update",
    method: "PUT" as const,
    customTransformParams: (data: any) => data,
  },

  /**
   * 删除通知公告
   */
  delete: {
    path: (id: string) => `/notice/delete/${id}`,
    method: "DELETE" as const,
  },

  /**
   * 发布通知公告
   */
  publish: {
    path: (id: string) => `/notice/publish/${id}`,
    method: "POST" as const,
  },

  /**
   * 撤回通知公告
   */
  revoke: {
    path: (id: string) => `/notice/revoke/${id}`,
    method: "POST" as const,
  },
};
