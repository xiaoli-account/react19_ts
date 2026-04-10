/** @format */

import { useI18nStore } from "../stores/i18n-store";
import { LeeLogger } from "../utils/leeLogger";
/**
 * 国际化 Hook
 */
export const useI18n = () => {
  const { locale, setLanguage, getI18nByKey } = useI18nStore();

  const changeLocale = (newLocale: "zh-CN" | "en-US") => {
    setLanguage(newLocale);
    LeeLogger.info("用户点击切换语言按钮", newLocale);
  };

  return {
    locale,
    setLanguage: changeLocale,
    isZhCN: locale === "zh-CN",
    isEnUS: locale === "en-US",
    getI18nByKey,
  };
};
