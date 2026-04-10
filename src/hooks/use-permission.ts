/** @format */

import {
  hasAllBtnPermission,
  hasAnyBtnPermission,
  hasApiPermission,
  hasBtnPermission,
  hasRoutePermission,
} from "@/layout/utils/leePermission";

/**
 * 权限 Hook
 */
export const usePermission = () => {
  // 检查权限
  const hasRoutePerm = (permission: string) => {
    return hasRoutePermission(permission);
  };
  /**
   * 检查按钮权限
   * @param permission 按钮权限标识
   * @returns boolean
   * @use tsx {hasBtnPermission("module_system:user:create") && (<span>创建</span>)}
   */
  const hasBtnPerm = (permission: string) => {
    return hasBtnPermission(permission);
  };
  /**
   * 检查API权限
   * @param permission API权限标识
   * @returns boolean
   */
  const hasApiPerm = (permission: string) => {
    return hasApiPermission(permission);
  };
  /**
   * 检查按钮权限（任意一个满足）
   * @param permissions 按钮权限标识数组
   * @returns boolean
   * @use tsx {hasAnyBtnPermission(["btn:user:create","btn:user:update"]) && (<span>创建</span>)}
   */
  const hasAnyBtnPerm = (permissions: string[]) => {
    return hasAnyBtnPermission(permissions);
  };
  /**
   * 检查按钮权限（全部满足）
   * @param permissions 按钮权限标识数组
   * @returns boolean
   * @use tsx {hasAllBtnPermission(["btn:user:create","btn:user:update"]) && (<span>创建</span>)}
   */
  const hasAllBtnPerm = (permissions: string[]) => {
    return hasAllBtnPermission(permissions);
  };
  /**
   * 检查角色
   * @param role 角色标识
   * @returns boolean
   */
  const hasRole = (role: string) => {
    return role === "admin";
  };
  return {
    hasRoutePerm,
    hasBtnPerm,
    hasApiPerm,
    hasAnyBtnPerm,
    hasAllBtnPerm,
    hasRole,
  };
};
