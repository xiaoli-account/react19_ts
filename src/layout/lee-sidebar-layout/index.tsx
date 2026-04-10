/** @format */

import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useLayoutStore } from "../stores/layout-store";
import Sidebar from "./sidebar";
import LayoutBreadcrumb from "./breadcrumb";
import Tab from "./tab";
import "./styles/index.scss";

const { Content } = Layout;

const LeeSidebarLayout = () => {
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <Layout className="lee-sidebar-layout">
      {/* 左侧菜单 */}
      <Sidebar />
      <div
        className={`layout-divider ${sidebarCollapsed ? "collapsed" : ""}`}
      />

      {/* 右侧内容区域 */}
      <Layout
        className="layout-main"
        style={{ marginLeft: sidebarCollapsed ? 80 : 256 }}
      >
        {/* 右侧页面内容 */}
        <Layout className="layout-content">
          {/* 面包屑导航 */}
          <LayoutBreadcrumb />
          {/* 内容区域 + Tab */}
          <Tab>
            <Content className="content-wrapper">
              <Outlet />
            </Content>
          </Tab>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LeeSidebarLayout;
