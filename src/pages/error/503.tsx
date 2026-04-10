/** @format */

import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error503 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="503"
      subTitle="抱歉，服务暂时不可用，请稍后再试。"
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          返回
        </Button>
      }
    />
  );
};

export default Error503;
