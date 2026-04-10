/** @format */

import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useLayoutStore } from "../stores/layout-store";
import Header from "./header";
import Sidebar from "./sidebar";
import LayoutBreadcrumb from "./breadcrumb";
import Tab from "./tab";
import "./styles/index.scss";

const { Content } = Layout;

const LeeBasicLayout = () => {
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <Layout className="lee-basic-layout">
      {/* 顶部 Header */}
      <Header />

      {/* 下方内容区域 */}
      <Layout className="layout-main">
        {/* 左侧菜单 */}
        <Sidebar />

        <div
          className={`layout-divider ${sidebarCollapsed ? "collapsed" : ""}`}
        />

        {/* 右侧页面内容 */}
        <Layout
          className="layout-content"
          style={{ marginLeft: sidebarCollapsed ? 80 : 256 }}
        >
          {/* 面包屑导航 */}
          <LayoutBreadcrumb />

          {/* 页签 根据keepalive决定是否缓存 */}
          <Tab>
            {/* 内容区域 */}
            <Content className="content-wrapper">
              <Outlet />
            </Content>
          </Tab>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LeeBasicLayout;
