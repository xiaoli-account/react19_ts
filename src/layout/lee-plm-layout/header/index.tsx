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
import LayoutBreadcrumb from "../breadcrumb";

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
    <AntHeader className="layout-header">
      {/* 左侧：Logo和折叠按钮 */}
      <div className="header-left">
        {/* 标题 */}
        <div>AIPLM-PM DEMO</div>
        {/* 面包屑导航 */}
        <LayoutBreadcrumb />
      </div>

      {/* 右侧：功能按钮 */}
      <div className="header-right">
        {/* 搜索框 */}
        <SearchMenu />
        <Button>项目上下文 PRJ-0020</Button>
        <Button>项目 320 / 合同 860 / 工装 4200</Button>
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
      </div>
    </AntHeader>
  );
};

export default Header;
