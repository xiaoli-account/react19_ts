/** @format */

import type { ComponentType, ReactNode } from "react";

/**
 * 路由 Meta 信息
 */
export interface RouteMeta {
  /**
   * 页面标题
   *
   */
  title: string;

  /**
   * 菜单图标
   *
   */
  icon?: string;

  /**
   * 页面是否需要权限认证，
   * 当true时根据pagePermission判断是否有权限访问，
   * 当false时不需要pagePermission权限认证
   */
  requiresAuth?: boolean;

  /**
   * 页面访问权限标识/页面权限code码
   * 定义格式：page:module:action
   * 例如：page:system:user
   */
  pagePermission?: string;

  /**
   * 是否在菜单中隐藏
   *
   */
  hidden?: boolean;

  /**
   * 是否缓存页面
   *
   */
  keepAlive?: boolean;

  /**
   * 排序
   *
   */
  order?: number;

  /**
   * 外链
   *
   */
  external?: string;

  /**
   * 目标
   *
   */
  target?: "_blank" | "_self";

  /**
   * 国际化标识
   * 定义格式如：[lee-layout-routes].[路由name字段]
   * 示例：lee-layout-routes.Login
   */
  i18n?: string;
}

/**
 * 路由项
 */
export interface RouteItem {
  /**
   * 路径
   *
   */
  path: string;

  /**
   * 组件
   *
   */
  component?: ComponentType | (() => Promise<{ default: ComponentType }>);

  /**
   * 子路由
   *
   */
  children?: RouteItem[];

  /**
   * 重定向
   *
   */
  redirect?: string;

  /**
   * Meta 信息
   *
   */
  meta?: RouteMeta;

  /**
   * 路由名称
   *
   */
  name?: string;
}

/**
 * 菜单项类型
 */
export type MenuComponentType = "submenu" | "group" | "divider";

/**
 * 菜单项（用于侧边栏）
 */
export interface MenuItem {
  /**
   * 菜单项key
   *
   */
  key: string;
  /**
   * 菜单项label
   *
   */
  label: ReactNode;
  /**
   * 菜单项icon
   *
   */
  icon?: ReactNode;
  /**
   * 菜单项path
   *
   */
  path?: string;
  /**
   * 菜单项子路由
   *
   */
  children?: MenuItem[];
  /**
   * 菜单项外链
   *
   */
  external?: string;
  /**
   * 菜单项目标
   *
   */
  target?: "_blank" | "_self";
  /**
   * 是否隐藏
   * true   显示在菜单目录
   * false  在菜单目录隐藏
   */
  hidden?: boolean;
  /**
   * 菜单项排序
   *
   */
  sort?: number;
  /**
   * 菜单项类型
   *
   */
  type?: MenuComponentType;
  /**
   * 菜单id
   */
  id: string;
  /**
   * 菜单父级id
   */
  parent_id: string | null;
  /**
   * 菜单名称
   */
  title: string;
  /**
   * 路由name
   */
  name: string;
  /**
   * 页面组件路径
   */
  component: string;
  /**
   * 是否缓存
   */
  keep_alive: boolean;
  /**
   * 菜单状态
   * 0: 禁用
   * 1: 启用用
   */
  status?: "0" | "1";
  /**
   * 删除标识
   * 0: 未删除
   * 1: 已删除
   */
  del_flag: string;
  /**
   * 菜单类型
   * Directory: 目录
   * Menu: 菜单
   * Button: 按钮
   * Link: 链接
   */
  menu_type: "Directory" | "Menu" | "Button" | "Link";
  /**
   * 描述
   */
  description: string;
  /**
   * 创建时间
   */
  created_time: string;
  /**
   * 更新时间
   */
  updated_time: string;
  /**
   * 权限标识符
   */
  permission: string | null;
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  /**
   * 面包屑项title
   *
   */
  title: string;
  /**
   * 面包屑项path
   *
   */
  path?: string;
}
