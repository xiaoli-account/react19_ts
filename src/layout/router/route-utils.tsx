/**
 * @format
 *
 * 路由渲染工具模块-AppRouterV2使用
 *
 * 文件作用：
 * 本文件提供了一套完整的路由渲染工具函数，用于将路由配置对象转换为 React Router 的 Route 组件树。
 * 主要功能包括：
 * 1. 懒加载组件的缓存管理，避免重复创建 lazy 组件
 * 2. 根据路由配置递归渲染嵌套路由
 * 3. 处理路由重定向逻辑
 * 4. 自动添加 404 兜底路由
 *
 * 核心特性：
 * - 支持懒加载组件的缓存优化
 * - 支持嵌套路由的递归渲染
 * - 支持路由重定向配置
 * - 支持 Suspense 懒加载
 * - 自动处理 404 页面
 */

import { Fragment, Suspense, lazy } from "react";
import type { ComponentType, LazyExoticComponent, ReactNode } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import type { RouteItem } from "./router-type";

// 懒加载函数类型定义：返回一个 Promise，resolve 为包含 default 导出的组件
type LazyLoader = () => Promise<{ default: ComponentType<any> }>;

// 懒加载组件缓存 Map，用于存储已创建的 lazy 组件，避免重复创建
const lazyCache = new Map<string, LazyExoticComponent<ComponentType<any>>>();

/**
 * 获取懒加载组件（带缓存）
 *
 * 函数作用：
 * 根据 key 从缓存中获取或创建新的懒加载组件。
 * 使用缓存可以避免同一个组件被多次调用 lazy() 创建，提高性能。
 *
 * @param key - 缓存键，通常使用路由的 name 或 path
 * @param loader - 懒加载函数，返回动态导入的 Promise
 * @returns 懒加载的 React 组件
 */
const getLazyComponent = (key: string, loader: LazyLoader) => {
  const cached = lazyCache.get(key);
  if (cached) return cached;

  const Comp = lazy(loader);
  lazyCache.set(key, Comp);
  return Comp;
};

/**
 * 根据路径查找路由配置
 *
 * 函数作用：
 * 在路由配置树中递归查找指定路径的路由配置对象。
 * 支持在嵌套路由中深度搜索。
 *
 * @param routes - 路由配置数组
 * @param path - 要查找的路径
 * @returns 找到的路由配置对象，未找到则返回 undefined
 */
const findRouteByPath = (
  routes: RouteItem[],
  path: string
): RouteItem | undefined => {
  for (const r of routes) {
    if (r.path === path) return r;
    if (r.children) {
      const hit = findRouteByPath(r.children, path);
      if (hit) return hit;
    }
  }
  return undefined;
};

/**
 * 获取路由对应的 React 元素
 *
 * 函数作用：
 * 根据路由配置生成对应的 React 元素。
 * - 如果路由没有 component，但有子路由，则返回 <Outlet /> 用于渲染子路由
 * - 如果路由有 component，则创建懒加载组件并用 Suspense 包裹
 * - 否则返回 null
 *
 * @param route - 路由配置对象
 * @returns React 节点元素
 */
const getRouteElement = (route: RouteItem): ReactNode => {
  if (!route.component) {
    if (route.children && route.children.length > 0) {
      return <Outlet />;
    }
    return null;
  }

  // 约定：当前项目 routes.ts 中 component 为：() => import('...')
  const loader = route.component as LazyLoader;
  const key = route.name || route.path;
  const LazyComponent = getLazyComponent(key, loader);
  return (
    <Suspense fallback={null}>
      <LazyComponent />
    </Suspense>
  );
};

/**
 * 渲染路由配置为 Route 组件树
 *
 * 函数作用：
 * 将路由配置数组递归转换为 React Router 的 <Route> 组件树。
 * 这是路由渲染的核心函数，支持：
 * - 嵌套路由的递归渲染
 * - 路由重定向（redirect）
 * - 懒加载组件
 * - index 路由（默认子路由）
 *
 * 处理逻辑：
 * 1. 如果路由只有 redirect 且无 component 和 children，渲染为 <Navigate> 重定向
 * 2. 如果路由有 children，渲染为嵌套路由结构，递归处理子路由
 * 3. 如果路由有 redirect 且有 children，在子路由前添加 index 路由进行重定向
 * 4. 普通路由直接渲染为 <Route> 组件
 *
 * @param routes - 路由配置数组
 * @returns React 节点，包含完整的路由组件树
 */
export const renderRoutes = (routes: RouteItem[]): ReactNode => {
  /**
   * 渲染单个路由项
   *
   * 内部函数作用：
   * 根据路由配置的不同情况，渲染对应的 Route 组件。
   * 使用 keyPrefix 确保每个 Route 的 key 唯一。
   *
   * @param route - 单个路由配置对象
   * @param keyPrefix - key 前缀，用于生成唯一的 React key
   * @returns 渲染后的 Route 组件或 null
   */
  const renderRouteItem = (route: RouteItem, keyPrefix: string): ReactNode => {
    // 情况1：纯重定向路由（无组件、无子路由）
    if (
      route.redirect &&
      !route.component &&
      (!route.children || route.children.length === 0)
    ) {
      return (
        <Route
          key={`${keyPrefix}${route.path}`}
          path={route.path}
          element={<Navigate to={route.redirect} replace />}
        />
      );
    }

    const element = getRouteElement(route);

    // 情况2：有子路由的嵌套路由
    if (route.children && route.children.length > 0) {
      return (
        <Route
          key={`${keyPrefix}${route.path}`}
          path={route.path}
          element={element}
        >
          {/* 如果配置了 redirect，添加 index 路由进行默认重定向 */}
          {route.redirect && (
            <Route index element={<Navigate to={route.redirect} replace />} />
          )}
          {/* 递归渲染子路由 */}
          {route.children.map((child: RouteItem, index: number) =>
            renderRouteItem(child, `${keyPrefix}${route.path}-${index}-`)
          )}
        </Route>
      );
    }

    // 情况3：有重定向的叶子路由
    if (route.redirect) {
      return (
        <Route
          key={`${keyPrefix}${route.path}`}
          path={route.path}
          element={<Navigate to={route.redirect} replace />}
        />
      );
    }

    // 情况4：无有效元素，返回 null
    if (!element) return null;

    // 情况5：普通路由
    return (
      <Route
        key={`${keyPrefix}${route.path}`}
        path={route.path}
        element={element}
      />
    );
  };

  return (
    <Fragment>
      {routes.map((r: RouteItem, i: number) => renderRouteItem(r, `${i}-`))}
    </Fragment>
  );
};

/**
 * 渲染路由并自动追加 404 兜底路由
 *
 * 函数作用：
 * 在 renderRoutes 的基础上，自动添加一个 `path="*"` 的兜底路由来处理所有未匹配的路径。
 * 这确保了用户访问不存在的路径时能够正确显示 404 页面。
 *
 * 处理逻辑：
 * 1. 首先在路由配置中查找 `/404` 路径的路由配置
 * 2. 如果找到 `/404` 路由，使用其对应的组件作为 404 页面
 * 3. 如果未找到 `/404` 路由，则重定向到 `/404` 路径
 * 4. 将所有正常路由渲染后，追加一个 `path="*"` 的兜底路由
 *
 * 注意：
 * - `path="*"` 会匹配所有未被其他路由匹配的路径
 * - 这个函数的行为与手写 index.tsx 中的 Error404 处理逻辑保持一致
 *
 * @param routes - 路由配置数组
 * @returns React 节点，包含完整的路由树和 404 兜底路由
 */
export const renderRoutesWithNotFound = (routes: RouteItem[]): ReactNode => {
  // 查找路由配置中的 /404 路由
  const notFound = findRouteByPath(routes, "/404");

  // 如果找到 /404 路由，使用其元素；否则重定向到 /404
  const notFoundElement = notFound ? (
    getRouteElement(notFound)
  ) : (
    <Navigate to="/404" replace />
  );

  return (
    <Fragment>
      {/* 渲染所有正常路由 */}
      {renderRoutes(routes)}
      {/* 添加 * 兜底路由，捕获所有未匹配的路径 */}
      <Route
        path="*"
        element={notFoundElement || <Navigate to="/404" replace />}
      />
    </Fragment>
  );
};
