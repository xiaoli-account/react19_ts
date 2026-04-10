/** @format */

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error502 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="502"
      subTitle="抱歉，网关错误，请稍后再试。"
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          返回
        </Button>
      }
    />
  );
};

export default Error502;
