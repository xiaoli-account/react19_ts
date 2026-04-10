/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./zh-CN/index";
import enUS from "./en-US/index";
import { resources as businessResources } from "@/i18n/index";

const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

/**
 * 获取语言包资源
 * @returns
 */
const getResouces = () => {
  const mergedResources: Record<string, { translation: Record<string, any> }> =
    {};

  // 合并 layout 和业务页面的语言包
  (Object.keys(resources) as Array<keyof typeof resources>).forEach(
    (locale) => {
      const layoutNamespaces = new Set<string>();
      const businessNamespaces = new Set<string>();
      const duplicateNamespaces: string[] = [];

      // 收集 layout 的顶级命名空间
      Object.keys(resources[locale].translation).forEach((key) => {
        layoutNamespaces.add(key);
      });

      // 收集业务页面的顶级命名空间
      if (businessResources[locale]?.translation) {
        Object.keys(businessResources[locale].translation).forEach((key) => {
          businessNamespaces.add(key);
        });

        // 找出重复的命名空间
        businessNamespaces.forEach((namespace) => {
          if (layoutNamespaces.has(namespace)) {
            duplicateNamespaces.push(namespace);
          }
        });

        // 如果有重复命名空间，抛出错误
        if (duplicateNamespaces.length > 0) {
          throw new Error(
            `国际化语言包冲突检测到重复命名空间 [${locale}]: ${duplicateNamespaces.join(", ")}\n` +
              `请确保业务页面和 layout 的语言包命名空间不重复。\n` +
              `建议使用不同的命名空间来避免冲突，例如：\n` +
              `- 业务页面建议使用业务模块名称命名：'login', 'user', 'dashboard'\n` +
              `- Layout 关键字有：'lee-layout-layout', 'lee-layout-header', 'lee-layout-routes'\n` +
              `- 系统 关键字有：'lee-layout-webSite', 'lee-layout-language', 'lee-layout-theme'`
          );
        }
      }

      mergedResources[locale] = {
        translation: {
          ...businessResources[locale]?.translation,
          ...resources[locale].translation,
        },
      };
    }
  );

  return mergedResources;
};

/**
 * 获取缓存的语言设置
 * @returns
 */
const getInitialLanguage = () => {
  try {
    const persistedState = localStorage.getItem("layout-i18n-storage");
    if (persistedState) {
      const { state } = JSON.parse(persistedState);
      return state?.locale || "zh-CN";
    }
  } catch (error) {
    console.warn("Failed to get initial language from localStorage:", error);
  }
  return "zh-CN";
};

i18n.use(initReactI18next).init({
  resources: getResouces(),
  lng: getInitialLanguage(), // 使用缓存的语言设置
  fallbackLng: "zh-CN", // 回退语言
  interpolation: {
    escapeValue: false, // React 已经默认转义
  },
});

export default i18n;
