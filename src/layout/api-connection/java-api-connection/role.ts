/**
 * fastapi服务 角色管理相关接口路径与类型配置
 *
 * @format
 */

export default {
  /**
   * 分页查询角色列表
   */
  pageList: {
    path: "/role/pageList",
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
   * 根据ID查询详情
   */
  findById: {
    path: "/role/findById",
    method: "GET" as const,
    customTransformParams: (id: string) => ({ id }),
    customTransformResponse: (data: any) => data,
  },

  /**
   * 新增或更新数据
   */
  saveOrUpdate: {
    path: "/role/saveOrUpdate",
    method: "POST" as const,
    customTransformParams: (data: any) => data,
  },

  /**
   * 删除数据
   */
  delete: {
    path: "/role/delete",
    method: "POST" as const,
    customTransformParams: (id: string) => ({ id }),
  },

  /**
   * 批量删除
   */
  batchDelete: {
    path: "/role/batchDelete",
    method: "POST" as const,
    customTransformParams: (ids: string[]) => ({ ids }),
  },

  /**
   * 更新状态
   */
  updateStatus: {
    path: "/role/updateStatus",
    method: "POST" as const,
    customTransformParams: (id: string, status: number) => ({ id, status }),
  },
};
