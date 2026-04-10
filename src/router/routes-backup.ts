/** @format */

import type { RouteItem } from "@/layout/router/router-type";

// 静态路由配置
export const staticRoutes: RouteItem[] = [
  {
    path: "/loading",
    name: "Loading",
    component: () => import("@/pages/sso-loading"),
    meta: {
      title: "加载中",
      i18n: "lee-layout-routes.Loading",
      pagePermission: "page:loading",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/login"),
    meta: {
      title: "登录",
      i18n: "lee-layout-routes.Login",
      pagePermission: "page:login",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/login/register"),
    meta: {
      title: "注册",
      i18n: "lee-layout-routes.Register",
      pagePermission: "page:register",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/login-dark",
    name: "LoginDark",
    component: () => import("@/pages/login/index-dark"),
    meta: {
      title: "登录暗色",
      i18n: "lee-layout-routes.LoginDark",
      pagePermission: "page:login-dark",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/401",
    name: "Error401",
    component: () => import("@/pages/error/401"),
    meta: {
      title: "401",
      i18n: "lee-layout-routes.Error401",
      pagePermission: "page:error401",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/403",
    name: "Error403",
    component: () => import("@/pages/error/403"),
    meta: {
      title: "403",
      i18n: "lee-layout-routes.Error403",
      pagePermission: "page:error403",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/404",
    name: "Error404",
    component: () => import("@/pages/error/404"),
    meta: {
      title: "404",
      i18n: "lee-layout-routes.Error404",
      pagePermission: "page:error404",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/500",
    name: "Error500",
    component: () => import("@/pages/error/500"),
    meta: {
      title: "500",
      i18n: "lee-layout-routes.Error500",
      pagePermission: "page:error500",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/502",
    name: "Error502",
    component: () => import("@/pages/error/502"),
    meta: {
      title: "502",
      i18n: "lee-layout-routes.Error502",
      pagePermission: "page:error502",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/503",
    name: "Error503",
    component: () => import("@/pages/error/503"),
    meta: {
      title: "503",
      i18n: "lee-layout-routes.Error503",
      pagePermission: "page:error503",
      hidden: true,
      requiresAuth: false,
    },
  },
  {
    path: "/504",
    name: "Error504",
    component: () => import("@/pages/error/504"),
    meta: {
      title: "504",
      i18n: "lee-layout-routes.Error504",
      pagePermission: "page:error504",
      hidden: true,
      requiresAuth: false,
    },
  },
];

/**
 * 动态路由配置（需要权限控制）
 */
export const asyncRoutes: RouteItem[] = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout"),
    redirect: "/loading",
    meta: {
      title: "主体布局",
      i18n: "lee-layout-routes.Layout",
      icon: "SettingOutlined",
      pagePermission: "page:layout",
      hidden: false,
      requiresAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard"),
        meta: {
          title: "仪表盘",
          i18n: "lee-layout-routes.Dashboard",
          icon: "DashboardOutlined",
          pagePermission: "page:dashboard",
          keepAlive: true,
          hidden: false,
          requiresAuth: true,
        },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/pages/profile"),
        meta: {
          title: "个人中心",
          i18n: "lee-layout-routes.Profile",
          icon: "UserOutlined",
          pagePermission: "page:profile",
          hidden: true,
          requiresAuth: true,
          keepAlive: true,
        },
      },
      {
        path: "system-management",
        name: "SystemManagement",
        meta: {
          title: "系统管理",
          i18n: "lee-layout-routes.SystemManagement",
          icon: "SettingOutlined",
          pagePermission: "page:system-management",
          hidden: false,
          requiresAuth: true,
        },
        children: [
          {
            path: "user-management",
            name: "UserManagement",
            component: () =>
              import("@/pages/system-management/user-management"),
            meta: {
              title: "用户管理",
              i18n: "lee-layout-routes.UserManagement",
              icon: "UserOutlined",
              pagePermission: "page:system:user",
              hidden: false,
              requiresAuth: true,
              keepAlive: true,
            },
          },
          {
            path: "role-management",
            name: "RoleManagement",
            component: () =>
              import("@/pages/system-management/role-management"),
            meta: {
              title: "角色管理",
              i18n: "lee-layout-routes.RoleManagement",
              icon: "TeamOutlined",
              pagePermission: "page:system:role",
              hidden: false,
              requiresAuth: true,
              keepAlive: true,
            },
          },
          {
            path: "menu-management",
            name: "MenuManagement",
            component: () =>
              import("@/pages/system-management/menu-management"),
            meta: {
              title: "菜单管理",
              i18n: "lee-layout-routes.MenuManagement",
              icon: "MenuOutlined",
              pagePermission: "page:system:menu",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "sso-management",
            name: "SsoManagement",
            component: () => import("@/pages/system-management/sso-management"),
            meta: {
              title: "SSO 管理",
              i18n: "lee-layout-routes.SsoManagement",
              icon: "SettingOutlined",
              pagePermission: "page:system:sso",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "dict-management",
            name: "DictManagement",
            component: () =>
              import("@/pages/system-management/dict-management"),
            meta: {
              title: "字典管理",
              i18n: "lee-layout-routes.DictManagement",
              icon: "SettingOutlined",
              pagePermission: "page:system:dict",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "dict-data",
            name: "DictData",
            component: () =>
              import("@/pages/system-management/dict-management/dict-data"),
            meta: {
              title: "字典数据",
              i18n: "lee-layout-routes.DictData",
              icon: "SettingOutlined",
              pagePermission: "page:system:dict-data",
              requiresAuth: true,
              hidden: true,
              keepAlive: false,
            },
          },
          {
            path: "notice-management",
            name: "NoticeManagement",
            component: () =>
              import("@/pages/system-management/notice-management"),
            meta: {
              title: "通知公告",
              i18n: "lee-layout-routes.NoticeManagement",
              icon: "SettingOutlined",
              pagePermission: "page:system:notice",
              hidden: false,
              requiresAuth: true,
              keepAlive: true,
            },
          },
          {
            path: "log-management",
            name: "LogManagement",
            component: () => import("@/pages/system-management/log-management"),
            meta: {
              title: "日志管理",
              i18n: "lee-layout-routes.LogManagement",
              icon: "SettingOutlined",
              pagePermission: "page:system:log",
              hidden: false,
              requiresAuth: true,
              keepAlive: false,
            },
          },
          {
            path: "document-center",
            name: "DocumentCenter",
            component: () =>
              import("@/pages/system-management/document-center"),
            meta: {
              title: "文档中心",
              i18n: "lee-layout-routes.DocumentCenter",
              icon: "SettingOutlined",
              pagePermission: "page:system:document-center",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: "examples",
        name: "Examples",
        meta: {
          title: "示例页面",
          i18n: "lee-layout-routes.Examples",
          icon: "FileOutlined",
          pagePermission: "page:examples",
          hidden: false,
          requiresAuth: true,
        },
        children: [
          {
            path: "basic-example",
            name: "BasicExample",
            component: () => import("@/pages/examples/basic-example"),
            meta: {
              title: "基础页面示例",
              i18n: "lee-layout-routes.BasicExample",
              pagePermission: "page:examples:basic",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "ajax-example",
            name: "AjaxExample",
            component: () => import("@/pages/examples/ajax-example"),
            meta: {
              title: "Ajax 示例",
              i18n: "lee-layout-routes.AjaxExample",
              pagePermission: "page:examples:ajax",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "sse-example",
            name: "SseExample",
            component: () => import("@/pages/examples/sse-example"),
            meta: {
              title: "SSE 示例",
              i18n: "lee-layout-routes.SseExample",
              pagePermission: "page:examples:sse",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "websocket-example",
            name: "WebsocketExample",
            component: () => import("@/pages/examples/websocket-example"),
            meta: {
              title: "WebSocket 示例",
              i18n: "lee-layout-routes.WebsocketExample",
              pagePermission: "page:examples:websocket",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "logicflow-example",
            name: "LogicFlowExample",
            component: () => import("@/pages/examples/logicflow-example"),
            meta: {
              title: "LogicFlow 2.x 示例",
              i18n: "lee-layout-routes.LogicFlowExample",
              pagePermission: "page:examples:logicflow",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "large-screen-visualization",
            name: "LargeScreenVisualizationExample",
            component: () =>
              import("@/pages/examples/large-screen-visualization-example"),
            meta: {
              title: "大屏可视化示例",
              i18n: "lee-layout-routes.LargeScreenVisualizationExample",
              pagePermission: "page:examples:large-screen-visualization",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "table",
            name: "TableExample",
            component: () => import("@/pages/examples/table"),
            meta: {
              title: "表格示例",
              i18n: "lee-layout-routes.TableExample",
              pagePermission: "page:examples:table",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "form",
            name: "FormExample",
            component: () => import("@/pages/examples/form"),
            meta: {
              title: "表单示例",
              i18n: "lee-layout-routes.FormExample",
              pagePermission: "page:examples:form",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
          {
            path: "chart",
            name: "ChartExample",
            component: () => import("@/pages/examples/chart"),
            meta: {
              title: "图表示例",
              i18n: "lee-layout-routes.ChartExample",
              pagePermission: "page:examples:chart",
              requiresAuth: true,
              hidden: false,
              keepAlive: true,
            },
          },
        ],
      },
    ],
  },
];

export default [...staticRoutes, ...asyncRoutes];
