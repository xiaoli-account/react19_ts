/**
 * 本地存储工具 - 基于 localforage
 *
 * // 基本使用
 * import { storage, sessionStorage } from '@/utils/storage';
 *
 * // 设置数据
 * await storage.set('user', { name: 'John', age: 30 });
 *
 * // 获取数据
 * const user = await storage.get('user');
 *
 * // 删除数据
 * await storage.remove('user');
 *
 * // 清空所有数据
 * await storage.clear();
 *
 * // 获取所有键名
 * const keys = await storage.keys();
 *
 * // 遍历所有数据
 * await storage.iterate((value, key, number) => {
 *   console.log(key, value);
 * });
 *
 * // SessionStorage 使用
 * sessionStorage.set('temp', 'data');
 * const temp = sessionStorage.get('temp');
 * sessionStorage.remove('temp');
 * ```
 *
 * // 创建自定义存储实例
 * import { createStorage, StorageDriver } from '@/utils/storage';
 *
 * const customStorage = createStorage({
 *   driver: StorageDriver.INDEXEDDB,
 *   name: 'my_app',
 *   storeName: 'custom_store'
 * });
 *
 * await customStorage.setItem('key', 'value');
 * const value = await customStorage.getItem('key');
 * ```
 *
 * @format
 * @example ```typescript
 * @example ```typescript
 */

import localforage from "localforage";

// 存储实例配置
localforage.config({
  driver: localforage.LOCALSTORAGE, // 默认使用 localStorage
  name: "react19_ts_app",
  storeName: "app_localforage",
  version: 1.0,
});

/**
 * LocalForage 工具类
 */
export const storage = {
  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   * @returns Promise
   */
  set: <T = any>(key: string, value: T): Promise<T> => {
    return localforage.setItem(key, value);
  },

  /**
   * 获取存储项
   * @param key 键名
   * @returns Promise
   */
  get: <T = any>(key: string): Promise<T | null> => {
    return localforage.getItem<T>(key);
  },

  /**
   * 删除存储项
   * @param key 键名
   * @returns Promise
   */
  remove: (key: string): Promise<void> => {
    return localforage.removeItem(key);
  },

  /**
   * 清空所有存储
   * @returns Promise
   */
  clear: (): Promise<void> => {
    return localforage.clear();
  },

  /**
   * 获取所有键名
   * @returns Promise
   */
  keys: (): Promise<string[]> => {
    return localforage.keys();
  },

  /**
   * 获取存储项数量
   * @returns Promise
   */
  length: (): Promise<number> => {
    return localforage.length();
  },

  /**
   * 遍历所有存储项
   * @param iteratee 回调函数
   * @returns Promise
   */
  iterate: <T = any>(
    iteratee: (value: T, key: string, iterationNumber: number) => void | boolean
  ): Promise<void> => {
    return localforage.iterate(iteratee) as Promise<void>;
  },
};

/**
 * SessionStorage 工具类（基于原生 sessionStorage）
 */
export const sessionStorage = {
  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   */
  set: <T = any>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to set sessionStorage:", error);
    }
  },

  /**
   * 获取存储项
   * @param key 键名
   * @returns 值
   */
  get: <T = any>(key: string): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * 删除存储项
   * @param key 键名
   */
  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove sessionStorage:", error);
    }
  },

  /**
   * 清空所有存储
   */
  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error("Failed to clear sessionStorage:", error);
    }
  },

  /**
   * 获取所有键名
   * @returns 键名数组
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.sessionStorage);
    } catch {
      return [];
    }
  },
};

/**
 * 创建自定义存储实例
 * @param config 配置选项
 * @returns LocalForage 实例
 */
export const createStorage = (config: any): any => {
  return localforage.createInstance(config);
};

/**
 * 存储驱动枚举
 */
export const StorageDriver = {
  LOCALSTORAGE: localforage.LOCALSTORAGE,
  INDEXEDDB: localforage.INDEXEDDB,
  WEBSQL: localforage.WEBSQL,
};

// 导出 localforage 实例（用于高级用法）
export { localforage };
