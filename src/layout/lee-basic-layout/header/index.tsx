/** @format */

import {
  Layout,
  Button,
  Dropdown,
  Space,
  Avatar,
  Switch,
  Typography,
  Badge,
} from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  BulbOutlined,
  MenuFoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useHeader } from "../../hooks/use-header";
import "./styles.scss";
import ReactLogo from "@/assets/react.svg";
import NoticePopover from "./components/NoticePopover";
import SearchMenu from "./components/SearchMenu";
import { SystemSwitcher } from "../../components/System-Switcher";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { t } = useTranslation();
  const {
    theme,
    locale,
    userInfo,
    userMenuItems,
    languageMenuItems,
    layoutMenuItems,
    toggleTheme,
    handleUserMenuClick,
    handleLanguageMenuClick,
    handleLayoutMenuClick,
  } = useHeader();

  return (
    <AntHeader
      className="layout-header"
      style={{
        height: "var(--lee-basic-header-height)",
        padding: "var(--lee-basic-header-padding)",
        background: "var(--lee-basic-header-bg)",
        borderBottom: `1px solid var(--lee-basic-header-border)`,
        boxShadow: "0 1px 4px var(--lee-basic-header-shadow)",
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
      {/* 左侧：Logo和折叠按钮 */}
      <div className="header-left">
        <div className="header-logo">
          {/* <span className="logo-icon">🚀</span> */}
          <img src={ReactLogo} className="logo-icon" alt="React logo" />

          <SystemSwitcher className="logo-text" />
        </div>
      </div>

      {/* 右侧：功能按钮 */}
      <div className="header-right">
        {/* 搜索框 */}
        <SearchMenu />
        <Space size="middle" className="header-right-space">
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
