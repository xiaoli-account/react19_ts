/** @format */

// 图数据
export const logicFlowGraphData = {
  nodes: [
    // 节点数据属性：节点1
    {
      id: "node_id_1",
      type: "rect",
      x: 50,
      y: 50,
      text: { x: 100, y: 100, value: "节点1" }, // 节点文本
      properties: {
        width: 80,
        height: 80,
        style: {
          stroke: "blue",
        },
        isPass: "true", //例如：在审批流场景，我们定义某个节点，这个节点通过了，节点为绿色，不通过节点为红色。
      },
    },
    // 节点2
    {
      id: "node_id_2",
      type: "circle",
      x: 200,
      y: 300,
      text: { x: 300, y: 300, value: "节点2" },
      properties: {},
    },
  ],
  edges: [
    // 边数据属性
    {
      id: "edge_id",
      type: "bezier",
      sourceNodeId: "node_id_1",
      targetNodeId: "node_id_2",
      text: { x: 139, y: 200, value: "连线" }, // 连线文本
      properties: {},
    },
  ],
};
