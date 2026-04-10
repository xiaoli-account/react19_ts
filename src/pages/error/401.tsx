/** @format */

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user";

const Error401 = () => {
  const navigate = useNavigate();
  const { resetUserStore } = useUserStore();

  const handleBackToLogin = () => {
    // 清除用户状态
    resetUserStore();
    // 跳转到登录页
    navigate("/login", { replace: true });
  };

  return (
    <Result
      status="403"
      title="401"
      subTitle="抱歉，您的登录已过期或未授权，请重新登录。"
      extra={
        <Button type="primary" onClick={handleBackToLogin}>
          返回登录
        </Button>
      }
    />
  );
};

export default Error401;
