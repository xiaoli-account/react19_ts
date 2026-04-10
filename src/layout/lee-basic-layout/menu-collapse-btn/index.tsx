/** @format */

import React from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLayoutStore } from "../../stores/layout-store";
import "./styles.scss";

interface MenuCollapseBtnProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const MenuCollapseBtn: React.FC<MenuCollapseBtnProps> = ({
  collapsed = false,
  onToggle,
}) => {
  const { toggleSidebar } = useLayoutStore();

  const handleClick = () => {
    toggleSidebar();
    onToggle?.();
  };

  return (
    <div
      className={`lee-basic-menu-collapse-btn ${collapsed ? "collapsed" : ""}`}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={handleClick}
      />
    </div>
  );
};

export default MenuCollapseBtn;
