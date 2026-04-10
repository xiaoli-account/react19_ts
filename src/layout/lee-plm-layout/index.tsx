/** @format */

import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import "./styles/index.scss";
import Header from "./header";
import Sidebar from "./sidebar";
import Aside from "./aside";

const { Content } = Layout;

const LeePlmLayout = () => {
  return (
    <Layout className="lee-plm-layout">
      {/* 左侧菜单 */}
      <Sidebar />

      {/* 中间内容区域 */}
      <Layout className="layout-main">
        {/* 顶部 Header */}
        <Header />

        {/* 内容区域 */}
        <Content className="content-wrapper">
          <Outlet />
        </Content>
      </Layout>

      {/* 右侧面板 ai side panel */}
      <Aside />
    </Layout>
  );
};

export default LeePlmLayout;
