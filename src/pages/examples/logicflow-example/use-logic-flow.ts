/** @format */

import { useRef, useState, useEffect } from "react";
import { logicFlowGraphData } from "./config";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/index.css";
import LeeNode from "./components/LeeNode";

export const useLogicFlow = () => {
  const graphData = logicFlowGraphData; // 画布初始化数据
  // 存储logicflow实例，用于非响应式场景
  const lfRef = useRef<LogicFlow | null>(null);
  // 存储logicflow实例，用于响应式场景
  const [lfInstance, setLfInstance] = useState<LogicFlow | null>(null);
  // 统一管理的事件分发状态
  const [nodeClickEvent, setNodeClickEvent] = useState<{
    data: any;
    timestamp: number;
  } | null>(null);

  /**
   * 初始化LogicFlow
   * @param ref 容器引用
   */
  function initLogicFlow(ref: any) {
    if (lfRef.current) return;
    console.log("Initializing LogicFlow...", graphData);

    // 设置容器的宽度和高度
    const refContainer = ref.current!;
    refContainer.style.width = "100%";
    refContainer.style.height = "100%";
    const lf = new LogicFlow({
      // 基础配置（必须配置，其他配置时情况而定）
      container: refContainer,
      width: refContainer.offsetWidth,
      height: refContainer.offsetHeight,
      // 网格配置
      grid: {
        size: 20,
        visible: true,
        type: "dot",
        config: {
          color: "rgba(102, 126, 234, 0.2)",
        },
      },
      // 背景配置
      background: {
        color: "rgba(30, 30, 46, 0.5)",
      },
      // 键盘快捷键配置
      keyboard: {
        enabled: true, // 启用键盘快捷键
        shortcuts: [
          {
            keys: ["backspace", "delete"],
            callback: () => {
              const lf = lfRef.current as LogicFlow | null;
              if (lf) {
                const { nodes, edges } = lf.getSelectElements(true);
                lf.clearSelectElements();
                edges.forEach((edge: any) => lf.deleteEdge(edge.id));
                nodes.forEach((node: any) => lf.deleteNode(node.id));
              }
            },
          },
        ],
      },
      edgeType: "bezier", // 内置支持的边类型有 line(直线)、polyline(折线)、bezier(贝塞尔曲线)，默认为折线polyline，用户可以自定义 type 名切换到用户自定义的边
      isSilentMode: false, // 非静默模式，允许删除等操作
      stopScrollGraph: true, // 禁止鼠标滚动移动画布（改用滚轮缩放）
      stopZoomGraph: false, // 禁止缩放画布
      stopMoveGraph: false, // 禁止移动画布
      textEdit: false, // 是否开启文本编辑
      snapline: true, // 对齐线是否开启
      // style属性配置 https://07.logic-flow.cn/guide/advance/theme.html#%E9%85%8D%E7%BD%AE
      style: {
        rect: {
          rx: 8,
          ry: 8,
        },
        // 锚点样式
        anchor: {
          r: 6,
          fillOpacity: 0.7,
          outlineColor: "#155aef",
          stroke: "#155aef",
          fill: "#155aef",
        },
      },
    });

    lfRef.current = lf; // 存储logicflow实例
    setLfInstance(lf); // 触发 React 响应式更新，将真实的 lf 实例传递出去

    // 注册自定义节点
    registerCustomNode(lf);

    // 注册节点事件监听
    registerEvents(lf);

    // 最后执行
    lf.render(graphData); // 渲染图数据
    lf.translateCenter(); // 将图形移动到画布中央
  }
  /**
   * 注册自定义节点
   */
  function registerCustomNode(lf: LogicFlow | null) {
    if (!lf) {
      return console.warn("LogicFlow实例不存在");
    }
    lf.register(LeeNode);
  }
  /**
   * 开始拖拽
   * @param config 节点配置
   */
  function startDrag(lf: LogicFlow | null, config: any) {
    if (!lf) {
      return console.warn("LogicFlow实例不存在");
    }
    lf.dnd.startDrag(config);
  }

  // 集中挂载 LogicFlow 相关的事件监听
  function registerEvents(lf: LogicFlow) {
    // 点击事件监听
    lf.on("node:click", (eventArgs: any) => {
      console.log("节点被点击了", eventArgs);
      setNodeClickEvent({ data: eventArgs.data, timestamp: Date.now() });
    });
    // 其他事件监听。。。
  }
  return {
    lf: lfInstance,
    initLogicFlow,
    startDrag,
    nodeClickEvent,
  };
};
