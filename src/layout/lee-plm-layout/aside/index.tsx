/** @format */

import { useLocation } from "react-router-dom";
import "./styles.scss";

const Aside = () => {
  const location = useLocation();

  return (
    <div className={`layout-aside`}>
      <div className="aside-header">AI Side Panel</div>
      <div className="aside-content">面板内容区</div>
    </div>
  );
};

export default Aside;
