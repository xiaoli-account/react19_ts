/** @format */

import { useLocation } from "react-router-dom";
import { useMenu } from "../../hooks/use-menu";
import "./styles.scss";

const LayoutBreadcrumb = () => {
  const location = useLocation();
  const { getBreadcrumbItem } = useMenu();
  const breadcrumbItem = getBreadcrumbItem(location.pathname);

  return <div className={`layout-breadcrumb`}>{breadcrumbItem}</div>;
};

export default LayoutBreadcrumb;
