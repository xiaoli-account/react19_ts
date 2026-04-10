/** @format */

import { Card, Row, Col } from "antd";

const ChartExample = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">图表示例</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="柱状图" bordered={false}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-gray-500">柱状图组件占位符</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="折线图" bordered={false}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-gray-500">折线图组件占位符</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="饼图" bordered={false}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-gray-500">饼图组件占位符</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="面积图" bordered={false}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-gray-500">面积图组件占位符</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="散点图" bordered={false}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-gray-500">散点图组件占位符</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartExample;
