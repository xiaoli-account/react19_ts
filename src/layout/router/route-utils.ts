/** @format */

import type { RouteObject } from "react-router-dom";
import { Suspense, lazy, createElement } from "react";
import type { ComponentType, LazyExoticComponent, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { RouteItem } from "./router-type";

// 懒加载函数类型定义
type LazyLoader = () => Promise<{ default: ComponentType<any> }>;

// 懒加载组件缓存 Map，用于存储已创建的 lazy 组件，避免重复创建
const lazyCache = new Map<string, LazyExoticComponent<ComponentType<any>>>();

/**
 * 获取懒加载组件（带缓存）
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
 * 将 RouteItem 转换为 React Router 的 RouteObject
 *
 * 此函数将项目自定义的路由配置格式转换为 React Router useRoutes 所需的标准格式
 *
 * @param routes - RouteItem 数组
 * @returns RouteObject 数组
 */
export function transformToRouteObject(routes: RouteItem[]): RouteObject[] {
  return routes.map((route) => {
    const routeObject: RouteObject = {
      path: route.path,
    };

    // 处理 component
    if (route.component) {
      const key = route.name || route.path;
      const LazyComponent = getLazyComponent(
        key,
        route.component as LazyLoader
      );
      routeObject.element = createElement(
        Suspense,
        { fallback: null },
        createElement(LazyComponent)
      );
    } else if (route.children && route.children.length > 0) {
      // 没有 component 但有 children，使用 Outlet
      routeObject.element = createElement(Outlet);
    }

    // 处理 redirect
    if (route.redirect) {
      if (
        !route.component &&
        (!route.children || route.children.length === 0)
      ) {
        // 纯重定向路由（无组件、无子路由）
        routeObject.element = createElement(Navigate, {
          to: route.redirect,
          replace: true,
        });
      } else if (route.children && route.children.length > 0) {
        // 有子路由的重定向，添加 index 路由
        routeObject.children = [
          {
            index: true,
            element: createElement(Navigate, {
              to: route.redirect,
              replace: true,
            }),
          },
          ...transformToRouteObject(route.children),
        ];
        return routeObject;
      } else {
        // 有组件的重定向（叶子节点）
        routeObject.element = createElement(Navigate, {
          to: route.redirect,
          replace: true,
        });
      }
    }

    // 处理 children（非重定向情况）
    if (route.children && route.children.length > 0 && !route.redirect) {
      routeObject.children = transformToRouteObject(route.children);
    }

    return routeObject;
  });
}

/**
 * 添加 404 兜底路由
 *
 * 在路由配置末尾添加 path="*" 的兜底路由，用于捕获所有未匹配的路径
 *
 * @param routes - RouteObject 数组
 * @param notFoundElement - 404 页面元素，如果不提供则重定向到 /404
 * @returns 添加了 404 路由的 RouteObject 数组
 */
export function addNotFoundRoute(
  routes: RouteObject[],
  notFoundElement?: ReactElement
): RouteObject[] {
  return [
    ...routes,
    {
      path: "*",
      element:
        notFoundElement ||
        createElement(Navigate, { to: "/404", replace: true }),
    },
  ];
}

/**
 * 根据路径查找路由配置（用于获取 404 页面元素）
 *
 * @param routes - RouteItem 数组
 * @param path - 要查找的路径
 * @returns 找到的路由配置对象，未找到则返回 undefined
 */
export const findRouteByPath = (
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
 * 获取路由对应的 React 元素（用于 404 页面）
 *
 * @param route - 路由配置对象
 * @returns React 节点元素
 */
export const getRouteElement = (route: RouteItem): ReactElement | null => {
  if (!route.component) {
    if (route.children && route.children.length > 0) {
      return createElement(Outlet);
    }
    return null;
  }

  const loader = route.component as LazyLoader;
  const key = route.name || route.path;
  const LazyComponent = getLazyComponent(key, loader);
  return createElement(
    Suspense,
    { fallback: null },
    createElement(LazyComponent)
  );
};
