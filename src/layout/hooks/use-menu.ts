/** @format */

import { useMemo } from "react";
import type {
  MenuComponentType,
  MenuItem,
  RouteItem,
} from "../router/router-type";
import * as Icons from "@ant-design/icons";
import { createElement } from "react";
import { HomeOutlined } from "@ant-design/icons";
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useMenuStore } from "../stores/menu-store";
import type { MenuItemType } from "antd/es/menu/interface";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

/**
 * 菜单Hook
 * 将路由配置转换为Antd菜单格式
 */
export const useMenu = (menuType?: MenuComponentType) => {
  const { t } = useTranslation();
  const {
    openKeys: cachedOpenKeys,
    selectedKeys: cachedSelectedKeys,
    setOpenKeys,
    setSelectedKeys,
    getRoutesMenu,
  } = useMenuStore();

  const normalizePath = (path: string) =>
    path.startsWith("/") ? path : `/${path}`;
  // 获取菜单路由数据
  const routes = getRoutesMenu();
  /**
   * 获取菜单项
   */
  const menus = useMemo(() => {
    return getMenusData(routes);
  }, [routes, i18n.language]);

  /**
   * 获取当前选中的菜单项
   */
  const getSelectedKeys = (pathname: string): string[] => {
    const targetPath = normalizePath(pathname);

    const findSelectedKey = (items: MenuItem[]): string | null => {
      // 先查找精确匹配的子菜单
      for (const item of items) {
        if (!item) continue;

        // 只检查有 path 属性的菜单项
        if (item.path === targetPath) return item.key;

        if (item.children && item.children.length > 0) {
          const hit = findSelectedKey(
            item.children.filter(Boolean) as MenuItem[]
          );
          if (hit) return hit;
        }
      }

      // 如果没有精确匹配，再查找前缀匹配（用于详情页等）
      for (const item of items) {
        if (!item || !item.path) continue;

        // 前缀匹配：例如 /user-management/detail/1 仍高亮 /user-management
        if (targetPath.startsWith(item.path + "/")) return item.key;
      }

      return null;
    };

    const key = findSelectedKey(menus.filter(Boolean) as MenuItem[]);
    return key ? [key] : [];
  };

  /**
   * 获取展开的菜单项
   */
  const getOpenKeys = (pathname: string): string[] => {
    const targetPath = normalizePath(pathname);

    const findOpenKeys = (
      items: MenuItem[],
      parents: string[] = []
    ): string[] => {
      for (const item of items) {
        if (!item) continue;

        // 如果当前 item 的子树中命中目标路径，则需要展开当前 item
        if (item.children && item.children.length > 0) {
          const childHit = findOpenKeys(
            item.children.filter(Boolean) as MenuItem[],
            [...parents, item.key]
          );
          if (childHit.length > 0) return childHit;
        }

        if (
          item.path &&
          (item.path === targetPath || targetPath.startsWith(item.path + "/"))
        ) {
          return parents;
        }
      }
      return [];
    };

    return findOpenKeys(menus.filter(Boolean) as MenuItem[]);
  };

  /**
   * 根据路径查找菜单项
   */
  const findMenuItem = (path: string): MenuItem | null => {
    const findInItems = (items: MenuItem[]): MenuItem | null => {
      for (const item of items) {
        if (item && item.path === path) {
          return item;
        }

        if (item && item.children) {
          const found = findInItems(
            item.children.filter(Boolean) as MenuItem[]
          );
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    return findInItems(menus.filter(Boolean) as MenuItem[]);
  };
  /**
   * 获取菜单数据
   * @param routes
   * @returns
   */
  function getMenusData(routes: RouteItem[]): MenuItemType[] {
    // 找到布局路由（有 children 的 path:"/" 路由才是 Layout）
    const layoutRoute = routes.find(
      (route: RouteItem) => route.path === "/" && route.children
    );
    if (!layoutRoute?.children) {
      return [];
    }
    const result = layoutRoute.children
      .map((item: RouteItem) => routeToMenuItem(item, ""))
      .filter(Boolean) as MenuItemType[];
    return result;
  }

  /**
   * 将路由转换为菜单项
   */
  function routeToMenuItem(route: RouteItem, parentPath: string) {
    const meta = route.meta;

    // 跳过隐藏的菜单项
    if (meta?.hidden) {
      return null;
    }

    const rawPath = String(route.path || "");
    const currentPath = rawPath.startsWith("/")
      ? rawPath
      : parentPath
        ? `${parentPath}/${rawPath}`
        : `/${rawPath}`;

    const menuItem: MenuItem = {
      key: currentPath,
      label: t(meta?.i18n || meta?.title || route?.name || ""),
      // 只有当路由有组件或没有子菜单时才设置路径
      path: route.component || !route.children ? currentPath : undefined,
    };

    // 处理图标（避免 createElement(undefined)）
    if (meta?.icon) {
      const IconComponent = (Icons as any)[meta.icon];
      if (IconComponent) {
        menuItem.icon = createElement(IconComponent) as any;
      }
    }

    // 处理外链
    if (meta?.external) {
      menuItem.external = meta.external;
      menuItem.target = meta.target || "_blank";
    }

    // 递归处理子菜单
    if (route.children && route.children.length > 0) {
      const children = route.children
        .map((child: RouteItem) => routeToMenuItem(child, currentPath))
        .filter(Boolean) as MenuItem[];

      if (children.length > 0) {
        menuItem.children = children;
        menuItem.type = menuType || "submenu";
      }
    }

    return menuItem;
  }

  /**
   * 获取面包屑数据
   */
  function getBreadcrumbItems(pathname: string): BreadcrumbItemType[] {
    const targetPath = normalizePath(pathname);
    const homeItem: BreadcrumbItemType = {
      key: "home", // 添加唯一 key
      title: createElement(HomeOutlined),
      href: "/",
    };
    // 找到布局路由
    const layoutRoute = routes.find((route: RouteItem) => route.path === "/");
    if (!layoutRoute?.children) {
      return [homeItem];
    }

    const breadcrumbItems: BreadcrumbItemType[] = [];

    // 递归查找匹配的路由路径
    const findRoutePath = (
      items: RouteItem[],
      parentPath: string,
      parents: BreadcrumbItemType[]
    ): boolean => {
      for (const item of items) {
        const rawPath = String(item.path || "");
        // 拼接当前路径
        const currentPath = rawPath.startsWith("/")
          ? rawPath
          : parentPath === "/"
            ? `/${rawPath}`
            : `${parentPath}/${rawPath}`;

        // 构建当前面包屑项
        const breadcrumbItem: BreadcrumbItemType = {
          key: currentPath, // 使用路径作为唯一 key
          title: t(item.meta?.i18n || item.name || ""),
        };

        // 如果完全匹配
        if (currentPath === targetPath) {
          // 将累积的父级和当前项加入结果
          breadcrumbItems.push(...parents, breadcrumbItem);
          return true;
        }

        // 如果是当前路径的前缀（处理子路由）
        if (item.children && item.children.length > 0) {
          // 只有当当前节点是有效页面时（有component），才添加链接
          // 注意：如果当前节点就是目标节点的父级目录，通常不跳链接，或者是 redirect
          if (item.component && !item.redirect) {
            breadcrumbItem.href = currentPath;
          }

          // 递归查找，匹配成功则返回
          if (
            findRoutePath(item.children, currentPath, [
              ...parents,
              breadcrumbItem,
            ])
          ) {
            return true;
          }
        }
      }
      return false;
    };

    findRoutePath(layoutRoute.children, "/", []);

    return [homeItem, ...breadcrumbItems];
  }

  /**
   * 获取当前正在打开的路由 title
   */
  function getBreadcrumbItem(pathname: string): string {
    const targetPath = normalizePath(pathname);

    // 找到布局路由
    const layoutRoute = routes.find((route: RouteItem) => route.path === "/");
    if (!layoutRoute?.children) {
      return "";
    }

    let title = "";

    const findTitle = (items: RouteItem[], parentPath: string): boolean => {
      for (const item of items) {
        const rawPath = String(item.path || "");
        const currentPath = rawPath.startsWith("/")
          ? rawPath
          : parentPath === "/"
            ? `/${rawPath}`
            : `${parentPath}/${rawPath}`;
        if (currentPath === targetPath) {
          title = t(item.meta?.i18n || item.meta?.title || item.name || "");
          return true;
        }

        if (item.children && item.children.length > 0) {
          if (findTitle(item.children, currentPath)) {
            return true;
          }
        }
      }
      return false;
    };
    findTitle(layoutRoute.children, "/");
    return title;
  }

  /**
   * 同步菜单状态到缓存
   */
  const syncMenuState = (pathname: string) => {
    const selectedKeys = getSelectedKeys(pathname);
    const openKeys = getOpenKeys(pathname);

    setSelectedKeys(selectedKeys);
    setOpenKeys(openKeys);

    return { selectedKeys, openKeys };
  };

  return {
    menus,
    getSelectedKeys,
    getOpenKeys,
    findMenuItem,
    getBreadcrumbItems,
    getBreadcrumbItem,
    syncMenuState,
    cachedOpenKeys,
    cachedSelectedKeys,
  };
};
