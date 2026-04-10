/** @format */

/**
 * 导航服务
 * 用于在非组件环境中进行路由跳转
 * 基于 React Router 的 navigate 函数
 * 如果没有设置 navigate 函数，则回退到 window.location.href
 * 配合 AppRouter 使用 src/router/index.tsx
 * 初始化导航服务
 * navigationService.setNavigate(navigate);
 */
class NavigationService {
  private navigate: ((path: string, options?: any) => void) | null = null;

  /**
   * 设置导航函数
   * @param navigateFn React Router 的 navigate 函数
   */
  setNavigate(navigateFn: (path: string, options?: any) => void) {
    this.navigate = navigateFn;
  }

  /**
   * 跳转到指定路径
   * @param path 路径
   */
  push(path: string) {
    if (this.navigate) {
      this.navigate(path);
    } else {
      console.warn(
        "Navigate function not set, falling back to window.location"
      );
      window.location.href = path;
    }
  }

  /**
   * 替换当前路径
   * @param path 路径
   */
  replace(path: string) {
    if (this.navigate) {
      this.navigate(path, { replace: true });
    } else {
      window.location.replace(path);
    }
  }
}

export const navigationService = new NavigationService();
