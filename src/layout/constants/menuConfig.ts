/** @format */

import type { MenuProps } from "antd";
import React from "react";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export function createMenuConfig(t: any) {
  /**
   * 用户菜单配置
   */
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: React.createElement(UserOutlined),
      label: t("lee-layout-header.profile"),
    },
    {
      key: "settings",
      icon: React.createElement(SettingOutlined),
      label: t("lee-layout-header.personalSettings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: React.createElement(LogoutOutlined),
      label: t("lee-layout-header.logout"),
    },
  ];

  /**
   * 语言菜单配置
   */
  const languageMenuItems: MenuProps["items"] = [
    {
      key: "zh-CN",
      label: t("lee-layout-language.zh-CN"),
    },
    {
      key: "en-US",
      label: t("lee-layout-language.en-US"),
    },
  ];

  /**
   * 布局模式菜单配置
   */
  const layoutMenuItems: MenuProps["items"] = [
    {
      key: "lee-basic",
      label: t("lee-layout-layout.lee-basic"),
    },
    {
      key: "lee-sidebar",
      label: t("lee-layout-layout.lee-sidebar"),
    },
    {
      key: "lee-top-menu",
      label: t("lee-layout-layout.lee-top-menu"),
    },
    {
      key: "lee-plm",
      label: t("lee-layout-layout.lee-plm"),
    },
  ];

  return {
    userMenuItems,
    languageMenuItems,
    layoutMenuItems,
  };
}
