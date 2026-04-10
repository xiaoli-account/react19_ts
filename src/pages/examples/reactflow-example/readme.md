# AI流程图ReactFlow插件

> 当前文档主要介绍ReactFlow的集成与基础示例
> 优点：ReactFlow是英文文档，社区强，文档强，功能更强
> 缺点：文档阅读困难、学习成本高、仅适用react
> 建议：选择react开发工作流、审批流那么ReactFlow是你的不二选择，完全可以无脑选

## 前言

	想偷懒的话，可以使用cursor工具，将需求提供给ai工具，让ai帮助快速集成和demo页面，虽然我不建议全部使用ai工具来制作
	
## 依赖安装
`npm install @xyflow/react`

## 配置
[官方地址](https://reactflow.dev/)
[快速上手](https://reactflow.dev/learn#installation)
[官方示例](https://reactflow.dev/examples)
[使用ReactFlow构建的经典案例，如：dify](https://reactflow.dev/showcase)

## 目录结构

```bash
src/pages/examples/reactflow-example/
├── components/                      # 组件目录
│   ├── LeeCustomEdge.tsx           # 自定义边组件
│   ├── LeeCustomNode.tsx           # 自定义节点组件
│   ├── LeeReactFlowContainer.tsx   # ReactFlow 容器组件
│   └── index.scss                  # 组件样式
├── config.ts                       # 配置文件
├── index.scss                      # 页面样式
├── index.tsx                       # 页面入口
├── readme.md                       # 说明文档
└── use-react-flow.ts               # ReactFlow 自定义 Hook
```


- 注意当前代码仅实现官方的基础案例，此示例会在git上持续更新补充，如需实现复杂逻辑与样式，请自行查阅官方文档进行定制开发
```tsx
// src/pages/examples/reactflow-example/index.tsx
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
```

```tsx
// src/pages/examples/reactflow-example/components/LeeReactFlowContainer.tsx
/** @format */
import { Modal, Form, Input, InputNumber } from "antd";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type Connection,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";

import "./index.scss";
import { reactFlowGraphData } from "../config";
import LeeNode from "./LeeCustomNode";
import LeeCustomEdge from "./LeeCustomEdge";

// 自定义节点类型
const nodeTypes = {
  lee: LeeNode,
};

// 自定义边类型
const edgeTypes = {
  lee: LeeCustomEdge,
};

// 初始节点数据
const initialNodes: Node[] = reactFlowGraphData.nodes as Node[];
const initialEdges: Edge[] = reactFlowGraphData.edges as Edge[];

const FlowContent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  // 编辑节点状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [form] = Form.useForm();

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  // 拖拽开始时设置节点类型数据
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // 允许放置
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // 处理放置，创建新节点，并利用 screenToFlowPosition 获取精准画布坐标
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      // 精准计算投影到画布中的 XY 坐标 (自动处理缩放/平移)
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${Date.now()}`,
        type: type === "lee" ? "lee" : type,
        position,
        data: {
          label: type === "lee" ? "Lee Node" : `${type} Node`,
          width: type === "lee" ? 150 : undefined,
          height: type === "lee" ? 60 : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode as Node));
    },
    [screenToFlowPosition]
  );

  // 点击节点触发弹出层（仅针对 Lee 自定义节点）
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "lee") {
        setEditingNode(node);
        form.setFieldsValue({
          label: node.data.label,
          width: node.data.width || 150,
          height: node.data.height || 60,
        });
        setIsModalOpen(true);
      }
    },
    [form]
  );

  // 处理模态框保存
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === editingNode?.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: values.label,
                width: values.width,
                height: values.height,
              },
            };
          }
          return node;
        })
      );
      setIsModalOpen(false);
      setEditingNode(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingNode(null);
  };

  return (
    <div className="reactflow-wrapper-with-sidebar">
      {/* 左侧节点侧边栏 */}
      <div className="reactflow-sidebar">
        <div className="sidebar-title">基础节点</div>
        <div
          className="sidebar-node default-node"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          默认节点
        </div>
        <div
          className="sidebar-node input-node"
          onDragStart={(event) => onDragStart(event, "input")}
          draggable
        >
          输入节点
        </div>
        <div
          className="sidebar-node output-node"
          onDragStart={(event) => onDragStart(event, "output")}
          draggable
        >
          输出节点
        </div>
        <div className="sidebar-divider" />
        <div className="sidebar-title">自定义节点</div>
        <div
          className="sidebar-node lee-node-drag"
          onDragStart={(event) => onDragStart(event, "lee")}
          draggable
        >
          Lee 节点
        </div>
      </div>
      {/* 画布区域 */}
      <div className="reactflow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={"dots" as any} gap={12} size={1} />
        </ReactFlow>
      </div>

      <Modal
        title="编辑节点属性"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="label"
            label="节点标题"
            rules={[{ required: true, message: "请输入节点标题" }]}
          >
            <Input placeholder="输入节点标题" />
          </Form.Item>
          <Form.Item
            name="width"
            label="节点宽度 (px)"
            rules={[{ required: true, message: "请输入节点宽度" }]}
          >
            <InputNumber
              min={50}
              max={1000}
              style={{ width: "100%" }}
              placeholder="输入节点宽度"
            />
          </Form.Item>
          <Form.Item
            name="height"
            label="节点高度 (px)"
            rules={[{ required: true, message: "请输入节点高度" }]}
          >
            <InputNumber
              min={30}
              max={1000}
              style={{ width: "100%" }}
              placeholder="输入节点高度"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const LeeReactFlowContainer = () => {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};

export default LeeReactFlowContainer;

```


# 使用时常见问题
## 中文文档地址
- [reactflow中文网](https://reactflow.nodejs.cn/)
## 使用reactflow渲染后只显示节点不显示连线？
- 使用浏览器开发者模式检查网页源代码react-flow__edges样式类，查看下方svg标签的生效样式，检查是否有全局样式影响svg的width属性
## 如何自定义节点
[](https://reactflow.dev/learn/customization/custom-nodes#implementing-a-custom-node)
## 如何自定义边
[](https://reactflow.dev/learn/customization/custom-edges#a-basic-custom-edge)
## 如何动态设置节点的高度
- 进行自定义节点时，在节点组件中增加props传参height属性，使用style属性设置组件高度
