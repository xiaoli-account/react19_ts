/** @format */

import { hasRoutePermission } from "@/layout/utils/leePermission";
import { clearAllCache } from "@/utils";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error403 = () => {
  const navigate = useNavigate();
    // 判断是否存在首页权限，有则跳转到首页，没有则跳转到登录页
    const hasHomePermission = hasRoutePermission("page:home");
  
    function goHome() {
      navigate("/workbench/home");
    }
    function goLogin() {
      clearAllCache();
      navigate("/login");
    }

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面。"
      extra={
        <Button type="primary" onClick={hasHomePermission ? goHome : goLogin}>
          {hasHomePermission ? "返回首页" : "返回登录"}
        </Button>
      }
    />
  );
};

export default Error403;
