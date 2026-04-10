/** @format */

import {
  Layout,
  Menu,
  Button,
  Space,
  Avatar,
  Dropdown,
  Switch,
  Typography,
  Badge,
} from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  BulbOutlined,
  BellOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useHeader } from "../../hooks/use-header";
import { useLocation, useNavigate } from "react-router-dom";
import { useMenu } from "../../hooks/use-menu";
import { useEffect, useState } from "react";
import "./styles.scss";
import ReactLogo from "@/assets/react.svg";
import NoticePopover from "./components/NoticePopover";
import SearchMenu from "./components/SearchMenu";
import { SystemSwitcher } from "../../components/System-Switcher";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { menus, syncMenuState, cachedSelectedKeys } = useMenu();
  const {
    theme,
    locale,
    userInfo,
    sidebarCollapsed,
    userMenuItems,
    languageMenuItems,
    layoutMenuItems,
    toggleTheme,
    handleUserMenuClick,
    handleLanguageMenuClick,
    handleLayoutMenuClick,
  } = useHeader();

  // 使用缓存的选中状态作为初始值
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(cachedSelectedKeys);

  useEffect(() => {
    // 同步菜单状态到缓存
    const { selectedKeys: newSelectedKeys } = syncMenuState(location.pathname);
    setSelectedKeys(newSelectedKeys);
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
    <AntHeader
      className="layout-top-header"
      style={{
        height: "var(--lee-topmenu-header-height)",
        padding: "var(--lee-topmenu-header-padding)",
        background: "var(--lee-topmenu-header-bg)",
        borderBottom: `1px solid var(--lee-topmenu-header-border)`,
        boxShadow: "0 1px 4px var(--lee-topmenu-header-shadow)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* 左侧：Logo 和菜单 */}
      <div className="top-header-left">
        <div className="top-logo">
          {/* <span className="logo-icon">🚀</span> */}
          <img src={ReactLogo} className="logo-icon" alt="React logo" />
          {!sidebarCollapsed && <SystemSwitcher className="logo-text" />}
        </div>

        <Menu
          mode="horizontal"
          className="layout-top-menu"
          selectedKeys={selectedKeys}
          items={menus}
          onClick={handleMenuClick}
        />
      </div>

      {/* 右侧：功能按钮 */}
      <div className="top-header-right">
        <Space size="middle" className="header-right-space">
          {/* 搜索框 */}
          <SearchMenu />

          {/* 通知 */}
          <NoticePopover>
            <Badge count={5} size="small" style={{ cursor: "pointer" }}>
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>
          </NoticePopover>

          {/* 主题切换 */}
          <Switch
            checked={theme === "dark"}
            onChange={(checked) => toggleTheme(checked ? "dark" : "light")}
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            className="theme-switch"
          />

          {/* 语言切换 */}
          <Dropdown
            menu={{
              items: languageMenuItems,
              onClick: handleLanguageMenuClick,
            }}
            placement="bottomRight"
          >
            <Button icon={<GlobalOutlined />}>
              {locale === "zh-CN"
                ? t("lee-layout-language.zh-CN")
                : t("lee-layout-language.en-US")}
            </Button>
          </Dropdown>

          {/* 布局切换 */}
          <Dropdown
            menu={{
              items: layoutMenuItems,
              onClick: handleLayoutMenuClick,
            }}
            placement="bottomRight"
          >
            <Button icon={<MenuFoldOutlined />}>
              {t("lee-layout-header.layout")}
            </Button>
          </Dropdown>

          {/* 用户菜单 */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <div className="header-user">
              <Avatar
                src={userInfo?.avatar || undefined}
                icon={<UserOutlined />}
                size="small"
                className="user-avatar"
              />
              <Text className="user-name" ellipsis>
                {userInfo?.nickname || userInfo?.loginName}
              </Text>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
