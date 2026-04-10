/** @format */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoginService } from "@/services/login-service";
import "./index.scss";
import { useUserStore } from "@/store/user";
import { getSSOToken } from "@/layout/utils";
import {
  filterRoutesByPerm,
  hasRoutePermission,
  initLeePermission,
} from "@/layout/utils/leePermission";
import routes, { layoutRoutes, staticRoutes } from "@/router/routes";
import { useRouterStore } from "@/layout/stores/router-store";
import type { RouteItem } from "@/layout/router/router-type";

/**
 * 递归查找第一个菜单类型路由
 * @param routes 路由列表
 * @returns 第一个菜单路由或 undefined
 */
const findFirstMenuRoute = (routes: RouteItem[]): RouteItem | undefined => {
  for (const route of routes) {
    // 不在菜单中隐藏且有 path 的路由视为菜单路由
    const isMenu =
      route.meta?.hidden !== false && route.path && !route.children?.length;
    if (isMenu) {
      return route;
    }
    if (route.children?.length) {
      const found = findFirstMenuRoute(route.children);
      if (found) return found;
    }
  }
  return undefined;
};

/**
 * SSO 中转站 加载页面
 * 用于检查用户登录状态并跳转到相应页面
 */
const TransferStation = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  /**
   * 初始化项目各个子系统的配置
   * ⚠️注意⚠️
   * ⚠️注意⚠️
   * 权限系统初始化必须在路由系统初始化之前
   * ⚠️注意⚠️
   * ⚠️注意⚠️
   */
  const initSubsystemConfig = (
    userInfo: any,
    callback: (() => void) | null
  ) => {
    const newRoutes = userInfo.routes;
    const pages = userInfo.pages || [];
    const apis = userInfo.apis || [];
    const btns = userInfo.btns || [];

    // 初始化权限系统
    initLeePermission({
      pagePermissionList: pages,
      btnPermissionList: btns,
      apiPermissionList: apis,
      btnPermEnabled: true,
      routePermEnabled: true,
      type: "layout",
    });
    // 初始化路由系统
    initRoutes(newRoutes, callback);
    /**
     * 初始化路由系统
     * @description 根据配置模式初始化路由
     * @param newRoutes 后端返回的路由配置（可选）
     */
    function initRoutes(newRoutes: any, callback?: (() => void) | null) {
      let allRoutes: any[];
      if (newRoutes && newRoutes.length > 0) {
        // 将后台路由 newRoutes 进行数据转换为前端可识别的路由配置
        layoutRoutes.children = transformRoutes(newRoutes);
        // 使用动态路由-由后端控制路由配置
        allRoutes = filterRoutesByPerm(staticRoutes, [layoutRoutes]);
      } else {
        // 使用静态路由-由前端控制路由配置
        allRoutes = filterRoutesByPerm(routes);
      }
      console.log("查看当前项目的路由配置数据", allRoutes);
      // 使用 store 更新路由配置
      useRouterStore.getState().setRoutes(allRoutes);
      callback?.();
      /**
       * 转换路由数据格式
       * @param routes 后台路由配置数据
       */
      function transformRoutes(routes: any[]): any[] {
        if (!routes || !Array.isArray(routes)) return [];
        // 使用 import.meta.glob 收集所有的页面组件模块，防止 Vite 动态 import 解析警告
        const pageModules = import.meta.glob("@/pages/**/*.tsx");
        const aiPageModules = import.meta.glob("@ai/pages/**/*.tsx");

        return routes.map((route: any) => {
          // 获取原始的 java 数据字段
          const reactRoute = { ...route };

          // 映射至 react 格式所需的字段
          reactRoute.path = route.route_path;
          reactRoute.name = route.name;

          // 如果存在 redirect 属性并且不为空
          if (route.redirect) {
            reactRoute.redirect = route.redirect;
          }

          // 组装 meta 数据
          reactRoute.meta = {
            title: route.title,
            ...route.meta, // 兼容如果后续接口直接返回了meta
            icon: route.icon || "AppstoreOutlined",
            pagePermission: route.permission,
            hidden: !!route.hidden,
            keepAlive: !!route.keep_alive,
          };

          // 处理由后端传递的 component_path 并转换为真正的 react 组件
          if (route.component_path) {
            // 解决 Vite 动态 import 全局无扩展名的警告
            const targetPath1 = `/src/pages/${route.component_path}.tsx`;
            const targetPath2 = `/src/pages/${route.component_path}/index.tsx`;

            const targetAIPath1 = `/src_ai/pages/${route.component_path}.tsx`;
            const targetAIPath2 = `/src_ai/pages/${route.component_path}/index.tsx`;

            if (pageModules[targetPath1]) {
              reactRoute.component = pageModules[targetPath1];
            } else if (pageModules[targetPath2]) {
              reactRoute.component = pageModules[targetPath2];
            } else if (aiPageModules[targetAIPath1]) {
              reactRoute.component = aiPageModules[targetAIPath1];
            } else if (aiPageModules[targetAIPath2]) {
              reactRoute.component = aiPageModules[targetAIPath2];
            } else {
              console.warn(
                `小李警告：[sso-loading/index.tsx] 无法匹配到路由组件: ${route.component_path}`
              );
            }
          }

          // 递归处理子层级，直至没有 children
          if (
            route.children &&
            Array.isArray(route.children) &&
            route.children.length > 0
          ) {
            reactRoute.children = transformRoutes(route.children);
          }

          return reactRoute;
        });
      }
    }
  };

  useEffect(() => {
    // 避免 React StrictMode 下执行两次
    if (hasRun.current) return;
    hasRun.current = true;

    console.log("进入loading");
    const loginService = new LoginService();

    const verifyLoginStatus = async () => {
      try {
        // 获取 Token (优先 URL，其次 Store)
        const token = getSSOToken();
        const localToken = useUserStore.getState().getToken();

        // 如果 Token 来自 URL 且与本地不同，更新本地 Store
        if (token && token !== localToken) {
          useUserStore.getState().setToken(token);
        }
        console.log("token", token);
        // 1. Token 校验：如果没有 Token，直接跳登录
        if (!token) {
          navigate("/login", { replace: true });
          return;
        } else {
          loginService
            .getUserInfo()
            .then((res) => {
              useUserStore.getState().setUserInfo(res.data);
              // 初始化项目各个子系统的配置
              initSubsystemConfig(res.data, function () {
                navigate("/dashboard", { replace: true });
                // 是否存在首页权限，有则跳转首页，无则取首位菜单类型的路由
                const hasHomePermission = hasRoutePermission("page:dashboard");
                if (hasHomePermission) {
                  navigate("/dashboard", { replace: true });
                } else {
                  // 获取路由，取首位菜单路由跳转
                  const allRoutes = useRouterStore.getState().routes;
                  const lay = allRoutes.filter(
                    (layout) => layout.name === "Layout"
                  );
                  const firstMenuRoute = findFirstMenuRoute(
                    lay[0]?.children || []
                  );
                  if (firstMenuRoute) {
                    navigate(firstMenuRoute.path, { replace: true });
                  } else {
                    navigate("/dashboard", { replace: true });
                  }
                }
              });
            })
            .catch((error) => {
              console.error("getUserInfo verification failed:", error);
              navigate("/login", { replace: true });
            });
        }
      } catch (error) {
        console.error("verifyLoginStatus verification failed:", error);
        // 3. 发生任何错误（Token 过期、网络错误等），回到登录页
        navigate("/login", { replace: true });
      }
    };

    verifyLoginStatus();
  }, [navigate]);

  return (
    <div className="transfer-station">
      <div className="loader"></div>
    </div>
  );
};

export default TransferStation;
