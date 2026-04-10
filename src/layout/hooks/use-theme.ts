/** @format */

import { useThemeStore } from "../stores/theme-store";
import { LeeLogger } from "../utils/leeLogger";

/**
 * 主题 Hook
 */
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();

  /**
   * 切换主题
   */
  const toggleTheme = (val?: "light" | "dark") => {
    let value = val;
    if (!val) {
      value = theme === "light" ? "dark" : "light";
    }
    setTheme(value as "light" | "dark");
    LeeLogger.info("用户点击切换主题按钮", value);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
