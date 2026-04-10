/** @format */
import { Typography, Card } from "antd";
import "./index.scss";
import LeeReactFlowContainer from "./components/LeeReactFlowContainer";

const { Title } = Typography;

const ReactFlowExample = () => {
  return (
    <div className="reactflow-main">
      <Title>ReactFlow 示例</Title>
      <Card className="reactflow-card">
        <p>拖拽左侧节点到画布创建新节点。点击 Lee 节点可修改宽高和标题。</p>
        <LeeReactFlowContainer />
      </Card>
    </div>
  );
};

export default ReactFlowExample;
