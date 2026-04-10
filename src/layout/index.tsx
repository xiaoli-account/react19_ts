/**
 * 布局管理器 - 唯一对外暴露的接口
 * 根据配置的布局模式渲染对应的布局组件
 * 所有布局的内部逻辑和样式都封装在各自的目录中
 *
 * @format
 */

import { useLayoutStore } from "./stores/layout-store";
import LeeBasicLayout from "./lee-basic-layout";
import LeeSidebarLayout from "./lee-sidebar-layout";
import LeeTopMenuLayout from "./lee-top-menu-layout";
import LeePlmLayout from "./lee-plm-layout";

const LayoutManager = () => {
  const { layoutMode } = useLayoutStore();

  const renderLayout = () => {
    switch (layoutMode) {
      case "lee-basic":
        return <LeeBasicLayout />;
      case "lee-sidebar":
        return <LeeSidebarLayout />;
      case "lee-top-menu":
        return <LeeTopMenuLayout />;
      case "lee-plm":
        return <LeePlmLayout />;
      default:
        return <LeeBasicLayout />;
    }
  };

  return renderLayout();
};

export default LayoutManager;
