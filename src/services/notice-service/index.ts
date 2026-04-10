/** @format */

import { $get, $post } from "@/layout/utils/request";
import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";

export interface NoticeRecord {
  id: string;
  title: string;
  type: string; // 'notification' | 'message' | 'event'
  content: string;
  status: number; // 0-草稿 1-已发布
  priority: string; // 'low' | 'medium' | 'high'
  createTime?: string;
  publishTime?: string;
}

export class NoticeService {
  /**
   * 获取通知公告分页列表
   * @param params 查询参数
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "通知公告",
    operation: OPERATION_TYPE.READ,
  })
  pageList(params: any) {
    // 实际开发中使用真实接口
    // return $get("/notice/list", params);

    // 示例：使用本地 mock 数据
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: NoticeRecord[] = [
          {
            id: "1",
            title: "系统维护通知",
            type: "notification",
            content: "系统将于今晚进行维护...",
            status: 1,
            priority: "high",
            createTime: "2026-02-04 10:00:00",
          },
          {
            id: "2",
            title: "新功能上线",
            type: "message",
            content: "新功能上线啦...",
            status: 0,
            priority: "medium",
            createTime: "2026-02-04 09:00:00",
          },
        ];
        resolve({
          success: true,
          code: 200,
          message: "查询成功",
          data: {
            records: mockData,
            total: 2,
            current: params.current || 1,
            size: params.size || 10,
          },
        });
      }, 500);
    });
  }

  /**
   * 保存或更新通知公告
   * @param data 数据对象
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "通知公告",
    operation: OPERATION_TYPE.UPDATE,
  })
  saveOrUpdate(data: Partial<NoticeRecord>) {
    // 实际开发中使用真实接口
    // if (data.id) {
    //   return $put("/notice/update", data);
    // }
    // return $post("/notice/add", data);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: data.id ? "更新成功" : "新增成功",
          data: null,
        });
      }, 500);
    });
  }

  /**
   * 删除通知公告
   * @param id 数据ID
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    module: "通知公告",
    operation: OPERATION_TYPE.DELETE,
  })
  delete(id: string) {
    // 实际开发中使用真实接口
    // return $deleteReq(`/notice/delete/${id}`);

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
   * 发布/撤回通知公告
   * @param id 数据ID
   * @param status 目标状态
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "通知公告",
    operation: OPERATION_TYPE.UPDATE,
  })
  updateStatus(id: string, status: number) {
    // 实际开发中使用真实接口
    // const url = status === 1 ? `/notice/publish/${id}` : `/notice/revoke/${id}`;
    // return $post(url);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: status === 1 ? "发布成功" : "撤回成功",
          data: null,
        });
      }, 500);
    });
  }
}
