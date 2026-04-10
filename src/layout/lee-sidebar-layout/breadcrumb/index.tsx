/** @format */

import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { useLayoutStore } from "../../stores/layout-store";
import { useMenu } from "../../hooks/use-menu";
import "./styles.scss";

const LayoutBreadcrumb = () => {
  const location = useLocation();
  const { sidebarCollapsed } = useLayoutStore();
  const { getBreadcrumbItems } = useMenu();

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <div className={`layout-breadcrumb ${sidebarCollapsed ? "collapsed" : ""}`}>
      <Breadcrumb items={breadcrumbItems} className="breadcrumb-nav" />
    </div>
  );
};

export default LayoutBreadcrumb;
