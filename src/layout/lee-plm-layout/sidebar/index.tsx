/** @format */

import { Layout, Menu, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayoutStore } from "../../stores/layout-store";
import { useMenu } from "../../hooks/use-menu";
import ProjectView from "./project-view";
import "./styles.scss";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useLayoutStore();
  const { menus, syncMenuState, cachedOpenKeys, cachedSelectedKeys } =
    useMenu("group");

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
        width={256}
        style={{
          background: "transparent",
          borderRight: "none",
          zIndex: 999,
        }}
      >
        <ProjectView className="sidebar-project" />
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
    </div>
  );
};

export default Sidebar;
