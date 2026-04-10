/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

export interface I18nState {
  locale: "zh-CN" | "en-US";
  setLanguage: (locale: "zh-CN" | "en-US") => void;
  getI18nByKey: (key: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: "zh-CN",
      /**
       * 设置语言
       * @param locale 语言
       */
      setLanguage: (locale) => {
        set({ locale });
        // 更新 HTML lang 属性
        document.documentElement.lang = locale;
        // 同步 i18next 语言（用于 useTranslation 的文案刷新）
        if (i18n.language !== locale) {
          void i18n.changeLanguage(locale);
        }
      },
      /**
       * 通过key获取文案
       * @param key 文案key
       * @returns 文案
       */
      getI18nByKey: (key: string) => {
        return i18n.t(key);
      },
    }),
    {
      name: "layout-i18n-storage",
      partialize: (state) => ({
        locale: state.locale,
      }),
    }
  )
);
