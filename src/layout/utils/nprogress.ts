/**
 * NProgress 路由加载进度条配置
 * 用于路由跳转时显示加载动画
 *
 * @format
 */

import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置 NProgress
NProgress.configure({
  showSpinner: false, // 不显示右上角的旋转图标
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
});

/**
 * 开始加载进度条
 */
export const startProgress = (): void => {
  NProgress.start();
};

/**
 * 完成加载进度条
 */
export const doneProgress = (): void => {
  NProgress.done();
};

/**
 * 设置进度条百分比
 * @param n 进度百分比（0-1 之间）
 */
export const setProgress = (n: number): void => {
  NProgress.set(n);
};

/**
 * 增加进度条
 * @param n 增加的百分比（可选）
 */
export const incProgress = (n?: number): void => {
  NProgress.inc(n);
};

/**
 * 移除进度条
 */
export const removeProgress = (): void => {
  NProgress.remove();
};

// 默认导出
export default {
  start: startProgress,
  done: doneProgress,
  set: setProgress,
  inc: incProgress,
  remove: removeProgress,
};
