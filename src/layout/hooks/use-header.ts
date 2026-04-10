/** @format */

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useI18n } from "../hooks";
import { useLayoutStore } from "../stores/layout-store";
import { useUserStore } from "@/store";
import { createMenuConfig } from "../constants/menuConfig";
import { App, type MenuProps } from "antd";
import { useTranslation } from "react-i18next";

/**
 * Header组件的公共Hook
 * 提供Header组件所需的通用状态和方法
 */
export const useHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLanguage } = useI18n();
  const { setLayoutMode, sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const { userInfo, logout } = useUserStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userMenuItems, languageMenuItems, layoutMenuItems } =
    createMenuConfig(t);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { message } = App.useApp();

  // 搜索框点击处理
  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        message.info("个人设置功能，正在开发中...");
        // navigate('/settings');
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  // 通知列表
  const handleNotices = () => {
    message.info("通知列表功能，正在开发中...");
  };
  // 语言菜单点击处理
  const handleLanguageMenuClick: MenuProps["onClick"] = ({ key }) => {
    setLanguage(key as "zh-CN" | "en-US");
  };

  // 布局模式菜单点击处理
  const handleLayoutMenuClick: MenuProps["onClick"] = ({ key }) => {
    setLayoutMode(key as "lee-basic" | "lee-sidebar" | "lee-top-menu");
  };

  // 顶部菜单点击处理
  const handleTopMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  return {
    // 状态
    theme,
    locale,
    userInfo,
    sidebarCollapsed,
    searchInputRef,

    userMenuItems,
    languageMenuItems,
    layoutMenuItems,

    // 方法
    toggleTheme,
    handleSearchClick,
    handleUserMenuClick,
    handleLanguageMenuClick,
    handleLayoutMenuClick,
    handleTopMenuClick,
    handleNotices,
    toggleSidebar,
  };
};
