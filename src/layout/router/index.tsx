/** @format */

import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import { useEffect, useMemo } from "react";
import { renderRoutesWithNotFound } from "./route-utils.tsx";
import {
  transformToRouteObject,
  addNotFoundRoute,
  findRouteByPath,
  getRouteElement,
} from "./route-utils.ts";
import { startProgress, doneProgress } from "@/layout/utils/nprogress.ts";
import "@/styles/nprogress.scss";
import { navigationService } from "@/layout/utils/navigation.ts";

import LayoutManager from "@/layout";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/pages/system-management/user-management";
import RoleManagement from "@/pages/system-management/role-management";
import SystemSettings from "@/pages/system-management/sso-management/index.tsx";
import TableExample from "@/pages/examples/table";
import FormExample from "@/pages/examples/form";
import ChartExample from "@/pages/examples/chart";
import Error403 from "@/pages/error/403";
import Error404 from "@/pages/error/404";
import Error500 from "@/pages/error/500";
import { LeeLogger } from "@/layout/utils/leeLogger.ts";
import { useUserStore } from "@/store/user.ts";
import { useRouterStore } from "@/layout/stores/router-store.ts";
import type { RouteItem } from "./router-type.ts";
import {
  filterRoutesByPerm,
  initLeePermission,
} from "../utils/leePermission.ts";
import { useMenuStore } from "../stores/menu-store.ts";

/**
 * 路由加载进度条组件
 * 监听路由变化，自动显示/隐藏加载进度条
 */
function RouteProgress() {
  const location = useLocation();

  useEffect(() => {
    startProgress();
    const timer = setTimeout(() => {
      doneProgress();
    }, 300);

    return () => {
      clearTimeout(timer);
      doneProgress();
    };
  }, [location.pathname]);

  return null;
}

/**
 * LeeRouter - 备份版本（静态路由）
 * 核心点：不依赖任何形式，硬编码形式实现路由功能
 * 保留作为对照参考
 */
const LeeRouter = () => {
  return (
    <>
      <RouteProgress />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<LayoutManager />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="role-management" element={<RoleManagement />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="examples/table" element={<TableExample />} />
          <Route path="examples/form" element={<FormExample />} />
          <Route path="examples/chart" element={<ChartExample />} />
        </Route>

        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/500" element={<Error500 />} />

        {/* 404 兜底 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

/**
 * LeeRouterV2 - 当前使用版本(动态路由)
 * 核心点：使用数据配置，实现路由的动态渲染
 */
const LeeRouterV2 = ({ routes }: { routes: RouteItem[] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 初始化日志系统
  useEffect(() => {
    LeeLogger.init({
      routes: routes,
      consoleEnabled: import.meta.env.MODE !== "production",
    });
  }, []);

  // 监听用户信息变化
  useEffect(() => {
    // 初始化时设置一次
    const userInfo = useUserStore.getState().userInfo;
    if (userInfo?.loginName && userInfo?.id) {
      LeeLogger.setCurrentUser(userInfo.loginName, userInfo.id);
    } else {
      LeeLogger.clearCurrentUser();
    }

    // 保存上一次的值,避免重复设置
    let previousLoginName = userInfo?.loginName;
    let previousUserId = userInfo?.id;

    // 订阅用户状态变化
    const unsubscribe = useUserStore.subscribe((state) => {
      const currentLoginName = state.userInfo?.loginName;
      const currentUserId = state.userInfo?.id;

      // 只有当userInfo真正变化时才执行
      if (
        previousLoginName !== currentLoginName ||
        previousUserId !== currentUserId
      ) {
        if (currentLoginName && currentUserId) {
          LeeLogger.setCurrentUser(currentLoginName, currentUserId);
        } else {
          LeeLogger.clearCurrentUser();
        }
        previousLoginName = currentLoginName;
        previousUserId = currentUserId;
      }
    });

    return () => unsubscribe();
  }, []);

  // 监听路由变化
  useEffect(() => {
    LeeLogger.setCurrentRoute(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // 初始化导航服务
    navigationService.setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <RouteProgress />
      <Routes>{renderRoutesWithNotFound(routes)}</Routes>
    </>
  );
};

/**
 * LeeRouterV3 - 当前使用版本(后台接口控制前端路由)
 * 核心点：根据后台返回的路由数据，进行更新路由配置
 * 优化点：使用 React Router 官方 useRoutes Hook，替代自定义渲染逻辑
 * 状态管理：使用 Zustand store 管理路由配置
 */
const LeeRouterV3 = ({ routes }: { routes: RouteItem[] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRoutes } = useRouterStore();
  // 从 store 中获取路由配置
  let newRoutes = getRoutes();

  /**
   * 页面刷新时，局部变量被置空，此时需获取缓存路由配置，重新初始化路由配置
   * 判断store是否有值，有值则以缓存为主，没值则以默认配置为主
   */
  if (newRoutes.length <= 0) {
    // 重新通过 useMenuStore 的持久化数据初始化权限系统，避免刷新后权限丢失导致的全量路由暴露
    const useMenu = useMenuStore.getState().routesMenu;
    const userInfo = useUserStore.getState();
    const pages = userInfo?.pages || [];
    const apis = userInfo?.apis || [];
    const btns = userInfo?.btns || [];
    initLeePermission({
      pagePermissionList: pages,
      btnPermissionList: btns,
      apiPermissionList: apis,
      btnPermEnabled: true,
      routePermEnabled: true,
      type: "refresh",
    });
    // 使用权限系统过滤存储过的安全的路由
    newRoutes = useMenu.routesMenu || routes;
  }

  // 转换路由配置为 useRoutes 所需格式
  const routeConfig = useMemo(() => {
    // 1. 将 RouteItem 转换为 RouteObject
    const transformed = transformToRouteObject(newRoutes);

    // 2. 查找 404 页面配置
    const notFoundRoute = findRouteByPath(newRoutes, "/404");
    const notFoundElement = notFoundRoute
      ? getRouteElement(notFoundRoute)
      : undefined;

    // 3. 添加 404 兜底路由
    return addNotFoundRoute(transformed, notFoundElement || undefined);
  }, [newRoutes]); // 依赖 routes，当路由更新时重新计算配置

  // 监听路由变化-初始化日志系统
  useEffect(() => {
    LeeLogger.init({
      routes: routes,
      consoleEnabled: import.meta.env.MODE !== "production",
    });
  }, [routes]);

  // 监听路由url变化-更新日志系统中的当前路由
  useEffect(() => {
    LeeLogger.setCurrentRoute(location.pathname);
  }, [location.pathname]);

  // 初始化导航服务-更新外部模块的导航服务
  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    // 监听用户信息变化-更新日志系统中的用户信息
    // 初始化时设置一次
    const userInfo = useUserStore.getState().userInfo;
    if (userInfo?.loginName && userInfo?.id) {
      LeeLogger.setCurrentUser(userInfo.loginName, userInfo.id);
    } else {
      LeeLogger.clearCurrentUser();
    }
    // 保存上一次的值,避免重复设置
    let previousLoginName = userInfo?.loginName;
    let previousUserId = userInfo?.id;

    // 订阅用户状态变化
    const unsubscribe = useUserStore.subscribe((state) => {
      const currentLoginName = state.userInfo?.loginName;
      const currentUserId = state.userInfo?.id;

      // 只有当userInfo真正变化时才执行
      if (
        previousLoginName !== currentLoginName ||
        previousUserId !== currentUserId
      ) {
        if (currentLoginName && currentUserId) {
          LeeLogger.setCurrentUser(currentLoginName, currentUserId);
        } else {
          LeeLogger.clearCurrentUser();
        }
        previousLoginName = currentLoginName;
        previousUserId = currentUserId;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <RouteProgress />
      {useRoutes(routeConfig)}
    </>
  );
};

// 导出当前使用的版本
export default LeeRouterV3;

// 导出备份版本
export { LeeRouter, LeeRouterV2 };
