/**
 * fastapi服务 字典管理相关接口路径与类型配置
 *
 * @format
 */

export default {
  /**
   * 分页查询字典类型列表
   */
  typePageList: {
    path: "/dict/type/pageList",
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
   * 获取某类型的字典数据列表
   */
  dataPageList: {
    path: "/dict/data/pageList",
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
   * 保存或更新字典类型
   */
  saveType: {
    path: "/dict/type/saveOrUpdate",
    method: "POST" as const,
    customTransformParams: (data: any) => data,
  },

  /**
   * 保存或更新字典数据
   */
  saveData: {
    path: "/dict/data/saveOrUpdate",
    method: "POST" as const,
    customTransformParams: (data: any) => data,
  },

  /**
   * 删除字典类型
   */
  deleteType: {
    path: "/dict/type/delete",
    method: "POST" as const,
    customTransformParams: (id: string) => ({ id }),
  },

  /**
   * 删除字典数据
   */
  deleteData: {
    path: "/dict/data/delete",
    method: "POST" as const,
    customTransformParams: (id: string) => ({ id }),
  },
};
