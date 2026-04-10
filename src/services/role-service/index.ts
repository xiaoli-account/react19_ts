/** @format */

import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";
import mockData from "@/services/example-service/mockData/response-table.json";

/**
 * 角色服务类
 * 演示标准的 CRUD 接口调用方式
 */
export class RoleService {
  /**
   * 无分页查询列表
   * @param data 查询参数
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  pageAllList(_data: object) {
    // 实际开发中使用真实接口
    // return $get("/api/example/pageAllList", data);

    // 示例：使用本地 mock 数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 500);
    });
  }
  /**
   * 分页查询列表
   * @param data 查询参数
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  pageList(_data: object) {
    // 实际开发中使用真实接口
    // return $get("/api/example/pageList", data);

    // 示例：使用本地 mock 数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 500);
    });
  }

  /**
   * 根据ID查询详情
   * @param id 数据ID
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  findById(id: string) {
    // 实际开发中使用真实接口
    // return $get("/api/example/findById", { id });

    // 示例：从 mock 数据中查找
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = mockData.data.records.find((item) => item.id === id);
        resolve({
          success: true,
          code: 200,
          message: "请求成功",
          data: record,
        });
      }, 300);
    });
  }

  /**
   * 新增或更新数据
   * @param data 数据对象
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.UPDATE,
  })
  saveOrUpdate(_data: object) {
    // 实际开发中使用真实接口
    // return $post("/api/example/saveOrUpdate", data);

    // 示例：模拟保存成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: "保存成功",
          data: null,
        });
      }, 500);
    });
  }

  /**
   * 删除数据
   * @param id 数据ID
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    operation: OPERATION_TYPE.DELETE,
  })
  delete(_id: string) {
    // 实际开发中使用真实接口
    // return $post("/api/example/delete", {}, { params: { id } });

    // 示例：模拟删除成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: "删除成功",
          data: null,
        });
      }, 500);
    });
  }

  /**
   * 批量删除
   * @param ids ID数组
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    operation: OPERATION_TYPE.DELETE,
  })
  batchDelete(ids: string[]) {
    // 实际开发中使用真实接口
    // return $post("/api/example/batchDelete", { ids });

    // 示例：模拟批量删除成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: `成功删除 ${ids.length} 条数据`,
          data: null,
        });
      }, 500);
    });
  }

  /**
   * 更新状态
   * @param id 数据ID
   * @param status 状态值
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.UPDATE,
  })
  updateStatus(_id: string, _status: number) {
    // 实际开发中使用真实接口
    // return $post("/api/example/updateStatus", { id, status });

    // 示例：模拟更新状态成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: "状态更新成功",
          data: null,
        });
      }, 300);
    });
  }
}
