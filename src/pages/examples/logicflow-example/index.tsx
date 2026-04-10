/** @format */

import { Card, Typography, Modal, Form, Input, InputNumber, Space } from "antd";
import { useLogicFlow } from "./use-logic-flow";
import { useEffect, useRef, useState } from "react";
import "./index.scss";
import type LogicFlow from "@logicflow/core";

const { Title } = Typography;

/**
 * LogicFlow2.x 示例页面
 * @returns
 */
const LogicFlowExample = () => {
  const { initLogicFlow, lf, startDrag, nodeClickEvent } = useLogicFlow();
  // 创建一个引用，用于存储容器元素
  const refContainer = useRef(null);

  // 初始化 LogicFlow
  useEffect(() => {
    initLogicFlow(refContainer);
  }, []);

  return (
    <div className="logicflow-main">
      <Title level={2}>LogicFlow 2.x 示例</Title>
      <div className="lf-container-wrapper">
        {/* 拖拽面板 */}
        <LogicFlowDragPanel lf={lf} startDrag={startDrag}></LogicFlowDragPanel>
        {/* 画布容器 */}
        <LogicFlowContainer
          lf={lf}
          refContainer={refContainer}
        ></LogicFlowContainer>
      </div>
      {/* 节点配置弹出层 */}
      <LogicFlowNodeEditModal lf={lf} nodeClickEvent={nodeClickEvent} />
    </div>
  );
};

/**
 * 节点编辑弹窗组件
 */
const LogicFlowNodeEditModal = (props: {
  lf: LogicFlow | null;
  nodeClickEvent: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // 响应统一分发的 node:click 事件
  useEffect(() => {
    if (props.nodeClickEvent) {
      const nodeData = props.nodeClickEvent.data;
      if (nodeData.type === "lee-node") {
        setCurrentNodeId(nodeData.id);
        form.setFieldsValue({
          content: nodeData.properties?.content || "自定义内容部分...",
          nodeWidth: nodeData.properties?.nodeWidth || 160,
          nodeHeight: nodeData.properties?.nodeHeight || 80,
        });
        setIsModalOpen(true);
      }
    }
  }, [props.nodeClickEvent, form]);

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (props.lf && currentNodeId) {
        props.lf.setProperties(currentNodeId, {
          content: values.content,
          nodeWidth: values.nodeWidth,
          nodeHeight: values.nodeHeight,
        });
      }
      setIsModalOpen(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="编辑节点内容"
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="自定义内容"
          name="content"
          rules={[{ required: true, message: "请输入内容文本" }]}
        >
          <Input.TextArea rows={3} placeholder="请输入内容文本" />
        </Form.Item>
        <Form.Item label="节点尺寸">
          <Space>
            <Form.Item name="nodeWidth" noStyle>
              <InputNumber
                placeholder="宽度 (默认160)"
                addonBefore="宽"
                min={50}
                max={500}
              />
            </Form.Item>
            <Form.Item name="nodeHeight" noStyle>
              <InputNumber
                placeholder="高度 (默认80)"
                addonBefore="高"
                min={30}
                max={500}
              />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * 画布容器组件
 * @param props
 * @returns
 */
const LogicFlowContainer = (props: {
  refContainer: any;
  lf: LogicFlow | null;
}) => {
  return <div className="lf-container" ref={props.refContainer}></div>;
};

/**
 * 拖拽面板组件
 * @returns
 */
const LogicFlowDragPanel = (props: {
  lf: LogicFlow | null;
  startDrag: any;
}) => {
  return (
    <div className="lf-drag-panel">
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "rect", text: "矩形" })
        }
      >
        矩形
      </div>
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "circle", text: "圆形" })
        }
      >
        圆形
      </div>
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "ellipse", text: "椭圆" })
        }
      >
        椭圆
      </div>
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "polygon", text: "多边形" })
        }
      >
        多边形
      </div>
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "diamond", text: "菱形" })
        }
      >
        菱形
      </div>
      <div
        className="node-item"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "text", text: "文本" })
        }
      >
        文本
      </div>
      {/* 自定义节点预留位置 */}
      <div
        className="node-item custom"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "custom-node", text: "自定义节点" })
        }
      >
        未注册节点
      </div>
      <div
        className="node-item custom"
        onMouseDown={() =>
          props.startDrag(props.lf, { type: "lee-node", text: "lee节点" })
        }
      >
        lee节点
      </div>
    </div>
  );
};

export default LogicFlowExample;
