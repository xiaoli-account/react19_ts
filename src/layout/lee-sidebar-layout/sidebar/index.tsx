/** @format */

import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Switch,
  Typography,
  Badge,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  BulbOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { useEffect, useState } from "react";
import { useMenu } from "@/layout/hooks/use-menu";
import { useHeader } from "@/layout/hooks/use-header";
import MenuCollapseBtn from "../menu-collapse-btn";
import ReactLogo from "@/assets/react.svg";
import NoticePopover from "./components/NoticePopover";
import SearchMenu from "./components/SearchMenu";
import { SystemSwitcher } from "../../components/System-Switcher";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const { t } = useTranslation();
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
  const navigate = useNavigate();
  const location = useLocation();
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
    <Sider
      className="layout-sidebar"
      collapsed={sidebarCollapsed}
      width={256}
      collapsedWidth={80}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        border: "none",
        zIndex: 1000,
        overflow: "auto",
      }}
    >
      {/* Logo - 横向布局 */}
      <div className={`layout-logo ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* <span className="logo-icon">🚀</span> */}
        <img src={ReactLogo} className="logo-icon" alt="React logo" />
        {!sidebarCollapsed && <SystemSwitcher className="logo-text" />}
      </div>
      {/* 外层折叠按钮 */}
      <MenuCollapseBtn collapsed={sidebarCollapsed} />

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

      {/* 底部功能区域 */}
      {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-ul">
            {/* 搜索框 */}
            <div className="sidebar-item search-item">
              <SearchMenu />
            </div>
            {/* 通知 */}
            <NoticePopover>
              <div className="sidebar-item justify-start">
                <BellOutlined />
                <Badge count={5} size="small">
                  <span>通知</span>
                </Badge>
              </div>
            </NoticePopover>
            {/* 主题切换 */}
            <div className="sidebar-item">
              <Switch
                checked={theme === "light"}
                onChange={(checked) => toggleTheme(checked ? "light" : "dark")}
                checkedChildren={<BulbOutlined />}
                unCheckedChildren={<BulbOutlined />}
                size="small"
              />
              <span>
                {theme === "dark"
                  ? t("lee-layout-header.darkTheme")
                  : t("lee-layout-header.lightTheme")}
              </span>
            </div>
            {/* 语言切换 */}
            <div className="sidebar-item">
              <Dropdown
                menu={{
                  items: languageMenuItems,
                  onClick: handleLanguageMenuClick,
                }}
                placement="topRight"
              >
                <div className="sidebar-item-content">
                  <GlobalOutlined />
                  {locale === "zh-CN"
                    ? t("lee-layout-language.zh-CN")
                    : t("lee-layout-language.en-US")}
                </div>
              </Dropdown>
            </div>

            {/* 布局切换 */}
            <div className="sidebar-item">
              <Dropdown
                menu={{
                  items: layoutMenuItems,
                  onClick: handleLayoutMenuClick,
                }}
                placement="topRight"
              >
                <div className="sidebar-item-content">
                  <MenuFoldOutlined />
                  {t("lee-layout-header.layout")}
                </div>
              </Dropdown>
            </div>

            {/* 用户菜单 */}
            <div className="sidebar-item">
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="topRight"
              >
                <div className="sidebar-item-content">
                  <Avatar
                    src={userInfo?.avatar || undefined}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <Text ellipsis style={{ marginLeft: 8, maxWidth: 120 }}>
                    {userInfo?.nickname || userInfo?.loginName}
                  </Text>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;
