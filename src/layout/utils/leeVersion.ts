/** @format */

import { useLocation } from "react-router-dom";
import pkg from "../../../package.json";
import { useEffect } from "react";

/**
 * 版本号管理工具 - 使用说明
 * 【类方式使用】
 * 建议配合 useEffect 使用
 * 适用于需要自定义配置或管理多个实例的场景
 *
 * ```ts
 * import { LeeVersion } from './layout/utils/leeVersion';
 *
 * // 创建自定义实例
 * const version = new LeeVersion();
 *
 * // 设置版本变化回调
 * version.onVersionChange((oldVersion, newVersion) => {
 *   console.log(`应用已更新: ${oldVersion} → ${newVersion}`);
 *   window.location.reload();
 * });
 *
 * // 执行版本检查
 * version.runVersionCheck();
 *
 * // 获取版本信息
 * console.log(version.formatVersion());      // v0.1.0
 * console.log(version.getVersionInfo());     // 完整信息对象
 * ```
 *
 * 【函数式使用】（推荐简单场景）
 * 建议配合 useEffect 使用
 * 适用于仅需获取版本或简单检查的场景
 *
 * ```ts
 * import leeVersion from "./layout/utils/leeVersion";
 *
 * // 直接使用单例方法
 * leeVersion.onVersionChange((oldV, newV) => {
 *   message.info(`发现新版本 ${newV}，即将刷新`);
 *   setTimeout(() => location.reload(), 1500);
 * });
 *
 * leeVersion.runVersionCheck();
 *
 * // 或仅获取版本信息
 * console.log(leeVersion.getCurrentVersion());  // 0.1.0
 * console.log(leeVersion.formatVersion('v'));   // v0.1.0
 * ```
 *
 * 【React 组件中使用示例】
 * 适用于需要在特定页面检查版本更新时使用
 *
 * import { useEffect } from 'react';
 * import leeVersion, { LeeVersionComponent } from "./layout/utils/leeVersion";
 *
 * return (<LeeVersionComponent />)
 */

/**
 * 版本号管理类
 * 用于获取应用版本、检测版本变化、提示用户刷新等
 */
class LeeVersion {
  /** 当前应用版本号 */
  private currentVersion: string;

  /** localStorage 中存储的版本号键名 */
  private readonly STORAGE_KEY = "lee_app_version";

  /** 版本变化回调函数 */
  private onVersionChangeCallback?: (
    oldVersion: string,
    newVersion: string
  ) => void;

  constructor() {
    this.currentVersion = this.getPackageVersion();
  }

  /**
   * 获取 package.json 中的版本号
   */
  getPackageVersion(): string {
    return pkg.version || "0.0.0";
  }

  /**
   * 获取当前应用版本号
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * 获取存储在 localStorage 中的版本号
   */
  getStoredVersion(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * 将当前版本号存储到 localStorage
   */
  storeVersion(version?: string): void {
    if (typeof window === "undefined") return;
    const v = version || this.currentVersion;
    localStorage.setItem(this.STORAGE_KEY, v);
  }

  /**
   * 检查版本是否发生变化
   * @returns {boolean} 版本是否变化
   */
  checkVersionChanged(): boolean {
    const storedVersion = this.getStoredVersion();
    if (!storedVersion) {
      // 首次访问，存储当前版本
      this.storeVersion();
      return false;
    }
    return storedVersion !== this.currentVersion;
  }

  /**
   * 比较两个版本号
   * @param v1 版本号1
   * @param v2 版本号2
   * @returns {number} -1: v1 < v2, 0: v1 = v2, 1: v1 > v2
   */
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);

    const maxLength = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }

    return 0;
  }

  /**
   * 检查当前版本是否大于存储的版本（新版本）
   */
  isNewVersion(): boolean {
    const storedVersion = this.getStoredVersion();
    if (!storedVersion) return true;
    return this.compareVersions(this.currentVersion, storedVersion) > 0;
  }

  /**
   * 设置版本变化回调
   */
  onVersionChange(
    callback: (oldVersion: string, newVersion: string) => void
  ): void {
    this.onVersionChangeCallback = callback;
  }

  /**
   * 异步获取远程配置中的版本号
   */
  async fetchRemoteVersion(): Promise<string | null> {
    try {
      // 加上时间戳防止缓存
      const res = await fetch(`/package.json?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        return data.version || null;
      }
    } catch (error) {
      console.error("[LeeVersion] 获取远程版本信息失败:", error);
    }
    return null;
  }

  /**
   * 执行版本检查，如有变化触发回调
   */
  async runVersionCheck(): Promise<void> {
    // 异步获取远端最新版本号
    const remoteVersion = await this.fetchRemoteVersion();

    // 优先校验远端版本（真实线上版本）与当前运行代码版本
    if (remoteVersion && remoteVersion !== this.currentVersion) {
      if (this.onVersionChangeCallback) {
        this.onVersionChangeCallback(this.currentVersion, remoteVersion);
      }
      this.storeVersion(remoteVersion);
      return;
    }

    // 回退校验：本地存储的版本缓存与当前运行代码版本比对
    const storedVersion = this.getStoredVersion();
    const hasChanged = this.checkVersionChanged();

    if (hasChanged && storedVersion && this.onVersionChangeCallback) {
      this.onVersionChangeCallback(storedVersion, this.currentVersion);
    }

    // 更新存储的版本号
    this.storeVersion();
  }

  /**
   * 格式化版本号显示
   * @param prefix 前缀，默认为 "v"
   */
  formatVersion(prefix = "v"): string {
    return `${prefix}${this.currentVersion}`;
  }

  /**
   * 获取版本信息对象
   */
  getVersionInfo() {
    return {
      current: this.currentVersion,
      stored: this.getStoredVersion(),
      isChanged: this.checkVersionChanged(),
      isNew: this.isNewVersion(),
      formatted: this.formatVersion(),
    };
  }
}

// 导出单例实例
export const leeVersion = new LeeVersion();

// 版本检查组件，监听路由变化
const LeeVersionComponent = () => {
  const location = useLocation();

  useEffect(() => {
    // URL 路径变化时执行版本检查
    console.log(`[LeeVersion] 路由变化: ${location.pathname}`);
    // 设置版本变化回调
    leeVersion.onVersionChange((oldVersion, newVersion) => {
      console.log(`[LeeVersion] 应用已更新: ${oldVersion} → ${newVersion}`);
      // 这里可以添加提示用户刷新页面的逻辑
      window.location.reload();
    });

    // 运行版本检查
    const versionInfo = leeVersion.getVersionInfo();
    console.log(`[LeeVersion] 当前版本: ${versionInfo.formatted}`);
    console.log(`[LeeVersion] 版本信息:`, versionInfo);

    leeVersion.runVersionCheck();
  }, [location.pathname]);

  return null;
};

// 导出类本身，方便需要自定义配置的场景
export { LeeVersion, LeeVersionComponent };

export default leeVersion;
