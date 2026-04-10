/** @format */

// 图数据
export const reactFlowGraphData = {
  // 节点数据属性
  nodes: [
    { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
    { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
  ],
  // 边数据属性
  edges: [
    {
      id: "n1-n2",
      source: "n1",
      target: "n2",
    },
  ],
};
