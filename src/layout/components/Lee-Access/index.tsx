/** @format */

import React from "react";
import {
  hasBtnPermission,
  hasAnyBtnPermission,
  hasAllBtnPermission,
} from "@/layout/utils/leePermission";
/**
 * 权限控制组件
 * @param permissionCode 权限标识 string: 单个权限标识 string[]: 多个权限标识
 * @param type 权限类型 any: 任意一个权限 all: 所有权限
 * @param fallback 权限不足时的回退组件
 * @param children slot组件
 * @returns 权限组件
 */
const LeeAccess = ({
  permissionCode,
  type = "any",
  fallback = null,
  children,
}: {
  permissionCode: string | string[];
  type?: "any" | "all";
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const ok = Array.isArray(permissionCode)
    ? type === "any"
      ? hasAnyBtnPermission(permissionCode)
      : hasAllBtnPermission(permissionCode)
    : hasBtnPermission(permissionCode);
  return <>{ok ? children : fallback}</>;
};
export default LeeAccess;
