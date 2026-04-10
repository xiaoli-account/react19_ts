/** @format */

import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "./header";
import LayoutBreadcrumb from "./breadcrumb";
import Tab from "./tab";
import "./styles/index.scss";

const { Content } = Layout;

const LeeTopMenuLayout = () => {
  return (
    <Layout className="lee-topmenu-layout">
      {/* 顶部 Header */}
      <Header />

      {/* 内容区域 */}
      <Layout className="layout-top-main">
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
  );
};

export default LeeTopMenuLayout;
