/** @format */

import { RectNode, RectNodeModel, h } from "@logicflow/core";

class LeeNodeModel extends RectNodeModel {
  initNodeData(data: any) {
    if (data.text && typeof data.text === "string") {
      data.text = {
        value: data.text,
        x: data.x,
        y: data.y,
      };
    }
    super.initNodeData(data);
    this.radius = 8;
  }

  setAttributes() {
    const { nodeWidth, nodeHeight } = this.properties || {};
    this.width = (nodeWidth as number) || 160;
    this.height = (nodeHeight as number) || 80;
  }

  // 鼠标悬浮与点击的样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    // 基础样式
    style.stroke = "#d9d9d9";
    style.strokeWidth = 1;
    
    // 悬浮样式
    if (this.isHovered) {
      style.stroke = "#155aef";
      style.strokeWidth = 1.5;
    }
    // 选中/点击样式
    if (this.isSelected) {
      style.stroke = "#155aef";
      style.strokeWidth = 2;
      style.shadowBlur = 8;
      style.shadowColor = "rgba(21, 90, 239, 0.3)";
    }
    return style;
  }

  // 自定义左右两端锚点
  getDefaultAnchor() {
    const { id, x, y, width } = this;
    return [
      {
        x: x - width / 2,
        y,
        type: "left",
        id: `${id}_left`,
      },
      {
        x: x + width / 2,
        y,
        type: "right",
        id: `${id}_right`,
      },
    ];
  }

  // 自定义锚点样式
  getAnchorStyle(anchorInfo: any) {
    const style = super.getAnchorStyle(anchorInfo);
    style.r = 4;
    style.fill = "#fff";
    style.stroke = "#155aef";
    style.strokeWidth = 2;
    // 悬浮时锚点变大变色
    if (this.isHovered) {
      style.r = 6;
      style.fill = "#155aef";
    }
    return style;
  }
}

class LeeNodeView extends RectNode {
  // 屏蔽默认的 text 渲染，由我们在 getShape 手动重绘
  getText() {
    return null;
  }

  getShape() {
    const { model } = this.props;
    const { x, y, width, height, radius } = model;
    const style = model.getNodeStyle();

    const headerHeight = 32;
    const nodeName = model.text?.value || "Lee节点"; // 名称
    const content = model.properties?.content || "自定义内容部分...";

    return h("g", {}, [
      // 1. 底层带圆角的基座（决定了边框样式、点击阴影等）
      h("rect", {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        rx: radius,
        ry: radius,
        fill: "#fff",
      }),

      // 2. 头部渐变背景（为了顶部切除圆角，使用 clipPath 限制范围在底层矩形内）
      h("defs", {}, [
        h("clipPath", { id: `clip_${model.id}` }, [
          h("rect", {
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            rx: radius,
            ry: radius,
          }),
        ]),
        h("linearGradient", { id: `grad_${model.id}`, x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, [
          h("stop", { offset: "0%", stopColor: "#5b8ff9" }),
          h("stop", { offset: "100%", stopColor: "#2f54eb" }),
        ]),
      ]),
      h("g", { clipPath: `url(#clip_${model.id})` }, [
        h("rect", {
          x: x - width / 2,
          y: y - height / 2,
          width,
          height: headerHeight,
          fill: `url(#grad_${model.id})`,
        }),
      ]),

      // 3. 头部文本（节点名称）
      h("text", {
        x: x,
        y: y - height / 2 + 20,
        textAnchor: "middle",
        fill: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        pointerEvents: "none",
        userSelect: "none",
      }, nodeName),

      // 4. Content 区域内容
      h("text", {
        x: x,
        y: y + height / 4 + 5,
        textAnchor: "middle",
        fill: "#666",
        fontSize: 12,
        pointerEvents: "none",
        userSelect: "none",
      }, content)
    ]);
  }
}

export default {
  type: "lee-node",
  view: LeeNodeView,
  model: LeeNodeModel,
};
