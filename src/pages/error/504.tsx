/** @format */

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error504 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="504"
      subTitle="抱歉，网关超时，请稍后再试。"
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          返回
        </Button>
      }
    />
  );
};

export default Error504;
