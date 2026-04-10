/** @format */

import { Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayoutStore } from "../../stores/layout-store";
import { useMenu } from "../../hooks/use-menu";
import MenuCollapseBtn from "../menu-collapse-btn";
import "./styles.scss";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useLayoutStore();
  const { menus, syncMenuState, cachedOpenKeys, cachedSelectedKeys } =
    useMenu();

  // 使用缓存的展开状态作为初始值
  const [openKeys, setOpenKeys] = useState<string[]>(cachedOpenKeys);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(cachedSelectedKeys);

  useEffect(() => {
    // 同步菜单状态到缓存
    const { selectedKeys: newSelectedKeys, openKeys: newOpenKeys } =
      syncMenuState(location.pathname);
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  }, [location.pathname]);

  /**
   * 处理菜单点击事件
   * @param param0 点击的菜单项
   */
  const handleMenuClick = ({ key }: { key: string }) => {
    // 构建完整的跳转路径
    const navigatePath = key.startsWith("/") ? key : `/${key}`;
    navigate(navigatePath);
  };

  return (
    <div className="layout-sidebar">
      <Sider
        collapsed={sidebarCollapsed}
        width={256}
        collapsedWidth={80}
        style={{
          position: "fixed",
          left: 0,
          top: "var(--lee-basic-header-height)",
          bottom: 0,
          background: "var(--lee-basic-sidebar-bg)",
          borderRight: "none",
          zIndex: 999,
          overflow: "auto",
        }}
      >
        {/* 菜单 */}
        <Menu
          mode="inline"
          className="layout-menu"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          items={menus}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* 折叠按钮 */}
      <MenuCollapseBtn collapsed={sidebarCollapsed} />
    </div>
  );
};

export default Sidebar;
