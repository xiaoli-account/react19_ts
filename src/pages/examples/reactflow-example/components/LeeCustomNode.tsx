/** @format */
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const LeeNode = ({
  data,
}: {
  data: { label: string; width?: number; height?: number };
}) => {
  return (
    <div
      className="lee-node"
      style={{
        width: data.width,
        height: data.height,
      }}
    >
      <div className="lee-node-label">{data.label}</div>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};

export default memo(LeeNode);
