/**
 * 分析统计插件
 *
 * @format
 */

// 页面访问统计
export const trackPageView = (page: string): void => {
  console.log(`Page view: ${page}`);
  // 这里可以集成 Google Analytics 或其他统计工具
};

// 事件追踪
export const trackEvent = (
  event: string,
  properties?: Record<string, any>
): void => {
  console.log(`Event: ${event}`, properties);
  // 这里可以集成自定义事件追踪
};

// 性能监控
export const trackPerformance = (metric: string, value: number): void => {
  console.log(`Performance: ${metric} - ${value}ms`);
  // 这里可以集成性能监控工具
};
