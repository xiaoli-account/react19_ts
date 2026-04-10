# AI流程图logicFlow插件

> 此文档围绕着react中的logicFlow的使用,由于在上个项目vue3_ts使用的[logicflow1.x版本](../../vue3+ts学习笔记/2-2 AI流程图logicFlow插件.md)，所以我强烈推荐大家使用2.x版本
> 有关自定义节点与内置动态分组（如：dify循环节点）做了很大优化
> 适用于开发拖拽式审批流、新型低代码开发、AI工作流构建方向

## 前言

	想偷懒的话，可以使用cursor工具，将需求提供给ai工具，让ai帮助快速集成和demo页面
	个人建议，还是要自行摸索出普通节点与自定义节点的创建，同时要熟练连线相关规则，当熟悉这些后，
	为ai提供规则，由ai生成方案并执行，可以方便自己后期的维护，不然的话读ai代码都读不懂就很难受了
	
## 依赖安装
`npm install @logicflow/core --save`或
`pnpm install @logicflow/core --save`

## 配置
[参考文档](http://logicflow.cn/tutorial/get-started)
[react自定义节点](http://logicflow.cn/tutorial/advanced/react)
[vue3自定义节点](http://logicflow.cn/tutorial/advanced/vue)

## 目录结构
```bash
logicflow-example/                  # LogicFlow 2.x 图形化画布编辑示例模块
├── components/                     # 自定义节点存放目录
│   └── lee-node.tsx                # 专属自定义节点 "lee节点"：继承与覆盖基础矩形，定义了自适应展示的 SVG 外观结构（含背景与渐变 header），支持动态宽高和渲染自定义内容
├── config.ts                       # 静态配置与数据：存放画板初始化图表的基础 Mock 数据 (logicFlowGraphData 等)
├── index.scss                      # 模块专属样式：提供画布外层容器样式、拖拽元素节点按钮的基础排版与高亮样式
├── index.tsx                       # 视图层统一主页面：负责整体 Layout，组合了可拖拽的左侧工具栏、画布渲染容器与右下角状态，并囊括了针对节点编辑的独立的弹窗展示器 (LogicFlowNodeEditModal)
└── use-logic-flow.ts               # 核心逻辑层 Hook：承担 LogicFlow 实例初始化 (`initLogicFlow`)、自定义节点统一关联注册、拖放控制 (`startDrag`) 以及底层生命周期事件（如节点点击 `node:click`）的集中侦听与响应式状态派发
```

- 注意当前代码仅实现官方的基础案例，此示例会在git上持续更新补充，如需实现复杂逻辑与样式，请自行查阅官方文档进行定制开发

```tsx
// 代码位置 src/pages/examples/logicflow-example/index.tsx
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
    <div className="">
      <Title level={2}>LogicFlow 2.x 示例</Title>
      <Card>
        <p>LogicFlow 2.x 示例页面正在开发中...</p>
      </Card>
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

```

# 使用时常见问题
`【Q】为什么logicflow的容器无法充满100%？`
- logicflow容器的宽高可以使用100%，但需要保证其父级节点的宽高百分比正确,参考下方示例
```tsx
<div style={{ width: "500px", height: "500px" }}>
	<div style={{ width: "100%", height: "100%" }} ref={refContainer}></div>
</div>
```
- 检查全局样式中是否存在svg标签的{ height: auto; }属性，存在当前属性就需要手动编写覆盖样式才会生效百分比效果
```scss
.lf-container-wrapper {
  height: 500px;
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-sizing: border-box;
}

.lf-container {
  height: 100%;
  width: 100%;

  /* 修复全局 reset.scss 中 svg { height: auto; } 导致 LogicFlow 画布高度缩水到 150px 的问题 */
  .lf-graph > svg {
    display: block;
    height: 100%;
  }
  .lf-graph > .lf-grid > svg {
    height: 100%;
  }
}
```
`【Q】如何在节点上绘制`
- 使用h函数进行绘制
`【Q】如何自定义节点`
[](http://logicflow.cn/api/model/edge-model)
`【Q】如何自定义边`
[](http://logicflow.cn/api/model/node-model)
`【Q】logicflow v1文档`
- [v1](https://07.logic-flow.cn/api/logicFlowApi.html#constructor)
`【Q】logicflow v2文档`
- [v2](http://logicflow.cn/api/detail/constructor)

## 结语

	此文档只是帮助你了解logicflow，让你明白它能做什么，减少你的技术选型时间，不能代替官方文档成为你使用的助手⚠️切记！
