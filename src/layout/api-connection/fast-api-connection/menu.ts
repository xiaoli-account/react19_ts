/** @format */

import type { MenuItem, MenuForm } from "@/layout/router/router-type";
import type { ReactNode } from "react";

/**
 * fastapi服务 菜单管理相关接口路径与类型配置
 *
 * @format
 */

/**
 * 搜索表单类型
 */
interface FastApiMenuSearchForm {
  name?: string;
  status?: string;
}
/**
 * 新增/编辑表单类型
 */
interface FastApiMenuForm {
  parent_id?: number | null;
  affix: boolean;
  always_show: boolean;
  component_path: string;
  description?: string;
  hidden: boolean;
  keep_alive: boolean;
  name: string;
  order: number;
  params: any;
  permission: string;
  redirect?: string;
  route_name: string;
  route_path: string;
  status: string;
  title: string;
  type: number;
  icon?: string | undefined | null | ReactNode;
}
/**
 * 返回列表类型
 */
interface FastApiMenuItem {
  id: number;
  "disable_flag": string;
  "del_flag": number;
  "description": string;
  "created_time": string;
  "updated_time": string;
  "name": string;
  "type": number; // 1:目录 2:菜单 3:按钮
  "order": number;
  "permission": string;
  "icon": string;
  "route_name": string;
  "route_path": string;
  "component_path": string;
  "redirect": string;
  "hidden": boolean;
  "keep_alive": boolean;
  "always_show": boolean;
  "title": string;
  "params": any;
  "affix": boolean;
  "parent_id": number | null;
  "parent_name": string | null;
  "children"?: FastApiMenuItem[];
}

export default {
  /**
   * 分页查询菜单列表
   */
  pageList: {
    path: "/system/menu/tree",
    method: "GET" as const,
    customTransformParams: (params: any): FastApiMenuSearchForm => {
      // 这里的转换取决于后端的实际接收参数，通常 status 我们将前端的 0(正常), 1(停用) 映射可能直接给后端即可
      // 前端 name 原意是输入 "控制台显示名称" 被你改成了 "name"，所以这里将 name 映射给后端的 title 搜索
      const query: any = {};
      if (params?.name) query.title = params.name;
      if (params?.status) {
        query.status = params.status === "0" ? "0" : "1"; // 前端停用是"1", 正常是"0"
      }
      return query;
    },
    customTransformResponse: (data: FastApiMenuItem[]): MenuItem[] => {
      const transform = (items: FastApiMenuItem[]): MenuItem[] => {
        return (items || []).map(
          (item) =>
            ({
              ...item,
              key: item.route_path || String(item.id),
              label: item.title,
              id: String(item.id),
              parent_id:
                item.parent_id !== null ? String(item.parent_id) : null,
              title: item.title,
              name: item.route_name,
              component: item.component_path,
              keep_alive: item.keep_alive,
              del_flag: String(item.del_flag),
              description: item.description || "",
              created_time: item.created_time,
              updated_time: item.updated_time,
              permission: item.permission,
              icon: item.icon,
              path: item.route_path,
              hidden: item.hidden,
              sort: item.order,
              menu_type:
                item.type === 1
                  ? "Directory"
                  : item.type === 2
                    ? "Menu"
                    : item.type === 3
                      ? "Button"
                      : "Link",
              status: item.disable_flag === "0" ? "1" : "0",
              children:
                item.children && item.children.length > 0
                  ? transform(item.children)
                  : [],
            }) as unknown as MenuItem
        );
      };
      return transform(data);
    },
  },

  /**
   * 根据ID查询详情
   */
  findById: {
    path: "/system/menu/detail",
    method: "GET" as const,
    customTransformParams: (id: string) => ({ id }),
    customTransformResponse: (data: FastApiMenuItem): MenuItem => {
      const transform = (items: FastApiMenuItem[]): MenuItem[] => {
        return (items || []).map(
          (item) =>
            ({
              ...item,
              key: item.route_path || String(item.id),
              label: item.title,
              id: String(item.id),
              parent_id:
                item.parent_id !== null ? String(item.parent_id) : null,
              title: item.title,
              name: item.route_name,
              component: item.component_path,
              keep_alive: item.keep_alive,
              del_flag: String(item.del_flag),
              description: item.description || "",
              created_time: item.created_time,
              updated_time: item.updated_time,
              permission: item.permission,
              icon: item.icon,
              path: item.route_path,
              hidden: item.hidden,
              sort: item.order,
              menu_type:
                item.type === 1
                  ? "Directory"
                  : item.type === 2
                    ? "Menu"
                    : item.type === 3
                      ? "Button"
                      : "Link",
              status: item.disable_flag === "0" ? "1" : "0",
              children:
                item.children && item.children.length > 0
                  ? transform(item.children)
                  : [],
            }) as unknown as MenuItem
        );
      };

      return {
        ...data,
        key: data.route_path || String(data.id),
        label: data.title,
        id: String(data.id),
        parent_id: data.parent_id !== null ? String(data.parent_id) : null,
        title: data.title,
        name: data.route_name,
        component: data.component_path,
        keep_alive: data.keep_alive,
        del_flag: String(data.del_flag),
        description: data.description || "",
        created_time: data.created_time,
        updated_time: data.updated_time,
        permission: data.permission,
        icon: data.icon,
        path: data.route_path,
        hidden: data.hidden,
        sort: data.order,
        menu_type:
          data.type === 1
            ? "Directory"
            : data.type === 2
              ? "Menu"
              : data.type === 3
                ? "Button"
                : "Link",
        status: data.disable_flag === "0" ? "1" : "0",
        children:
          data.children && data.children.length > 0
            ? transform(data.children)
            : [],
      } as unknown as MenuItem;
    },
  },

  /**
   * 新增菜单
   */
  create: {
    path: "/system/menu/create",
    method: "POST" as const,
    customTransformParams: (data: MenuForm): FastApiMenuForm => {
      const formatPath = (p?: string) =>
        p && !p.startsWith("/") ? "/" + p : p || "";
      return {
        affix: false,
        always_show: false,
        component_path: data.component || "",
        description: data.description || "",
        hidden: data.hidden || false,
        keep_alive: data.keep_alive || false,
        name: data.name || "",
        order: data.sort || 1,
        params: [],
        permission: data.permission || "",
        redirect: "",
        route_name: data.name || "",
        route_path: formatPath(data.path),
        status: data.status === "1" ? "0" : "1", // 前端 status: 1 是正常 0 是禁用；推测后端 "0" 可能表示正常(disable_flag="0")
        title: data.title || "",
        type:
          data.menu_type === "Directory"
            ? 1
            : data.menu_type === "Menu"
              ? 2
              : data.menu_type === "Button"
                ? 3
                : 4,
        parent_id: data.parent_id ? Number(data.parent_id) : null,
        icon: typeof data.icon === "string" ? data.icon : "",
      };
    },
  },
  /**
   * 更新菜单
   */
  update: {
    path: "/system/menu/update",
    method: "PUT" as const,
    customTransformParams: (data: MenuForm): FastApiMenuForm => {
      const formatPath = (p?: string) =>
        p && !p.startsWith("/") ? "/" + p : p || "";
      return {
        affix: false,
        always_show: false,
        component_path: data.component || "",
        description: data.description || "",
        hidden: data.hidden || false,
        keep_alive: data.keep_alive || false,
        name: data.name || "",
        order: data.sort || 1,
        params: null,
        permission: data.permission || "",
        redirect: "",
        route_name: data.name || "",
        route_path: formatPath(data.path),
        status: data.status === "1" ? "0" : "1",
        title: data.title || "",
        type:
          data.menu_type === "Directory"
            ? 1
            : data.menu_type === "Menu"
              ? 2
              : data.menu_type === "Button"
                ? 3
                : 4,
        parent_id: data.parent_id ? Number(data.parent_id) : null,
        icon: typeof data.icon === "string" ? data.icon : "",
      };
    },
  },

  /**
   * 批量删除
   */
  batchDelete: {
    path: "/system/menu/delete",
    method: "DELETE" as const,
    customTransformParams: (ids: number[]) => ids,
  },
};
