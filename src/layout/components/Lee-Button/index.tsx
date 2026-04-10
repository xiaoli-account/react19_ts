/** @format */

import React from "react";
import { hasBtnPermission } from "@/layout/utils/leePermission";
import { Button } from "antd";

/**
 * 按钮组件
 * @param permissionCode 按钮权限码
 * @param children 按钮内容=slot
 * @param props antd button 属性
 * @returns antd button 组件
 */
const LeeButton = ({
  permissionCode,
  children,
  ...props
}: {
  permissionCode: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const ok = hasBtnPermission(permissionCode);
  if (!ok) {
    return null;
  }
  return <Button {...props}>{children}</Button>;
};

export default LeeButton;
