/** @format */

import { theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useThemeStore, useI18nStore } from "../stores";

/**
 * Ant Design 配置 Hook
 * 统一管理组件库的主题和国际化配置
 */
export const useAntdConfig = () => {
  const { theme } = useThemeStore();
  const { locale } = useI18nStore();

  // 根据语言选择Ant Design语言包
  const antdLocale = locale === "zh-CN" ? zhCN : enUS;

  // 配置Ant Design主题
  const antdConfig = {
    algorithm:
      theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: theme === "dark" ? "#177ddc" : "#2f54eb",
      colorBgContainer: theme === "dark" ? "#1f1f1f" : "#ffffff",
      colorBgElevated: theme === "dark" ? "#262626" : "#ffffff",
      colorBgLayout: theme === "dark" ? "#141414" : "#f5f5f5",
      colorText:
        theme === "dark" ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.88)",
      colorTextSecondary:
        theme === "dark" ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
      colorBorder: theme === "dark" ? "#434343" : "#d9d9d9",
      colorBorderSecondary: theme === "dark" ? "#303030" : "#f0f0f0",
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
  };

  return {
    antdLocale,
    antdConfig,
  };
};
