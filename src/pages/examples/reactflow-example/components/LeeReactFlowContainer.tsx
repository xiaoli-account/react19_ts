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
