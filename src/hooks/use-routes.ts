/** @format */

import routes from "@/router/routes";

/**
 * 路由Hook
 * 提供路由相关的处理功能
 */
export const useRoutes = () => {
  /**
   * 获取路由配置
   * @returns 过滤后的路由配置
   */
  function getRoutes() {
    /**
     * 递归筛选路由
     * @param routes 路由数组
     * @returns 过滤后的路由数组
     */
    function usefilterRoutes(routes: any[]): any[] {
      return routes.filter((route) => {
        const meta = route.meta;

        // 如果当前路由隐藏，直接过滤掉
        if (meta?.hidden) {
          return false;
        }

        // 如果有子路由，递归筛选子路由
        if (route.children && route.children.length > 0) {
          route.children = usefilterRoutes(route.children);
        }

        return true;
      });
    }

    // 递归筛选出hidden为false的路由配置
    const newRoutes = usefilterRoutes(routes);

    return newRoutes;
  }

  return {
    getRoutes,
  };
};
