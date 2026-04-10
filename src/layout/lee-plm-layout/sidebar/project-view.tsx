/** @format */

import { Button, Select } from "antd";

export default function ProjectView({ className }: { className: string }) {
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  return (
    <div className={className}>
      <span className="project-name">AI-Native PLM + PM</span>
      <span className="project-version">AIPLM-PM</span>
      <span className="project-description">合同到量产前闭环 Demo</span>
      <div className="project-card">
        <span className="project-card-title">当前项目</span>
        <span className="project-card-code">PRJ-0020</span>
        <Select
          className="project-card-select"
          showSearch={{ optionFilterProp: "label", onSearch }}
          placeholder="请选择项目"
          onChange={onChange}
          options={[
            {
              value: "jack",
              label: "PRJ-0001 | 理想汽车-热管理模块-001",
            },
            {
              value: "lucy",
              label: "PRJ-0002 | 理想汽车-热管理模块-002",
            },
            {
              value: "tom",
              label: "PRJ-0003 | 理想汽车-热管理模块-003",
            },
          ]}
        />
        <Button className="project-card-button" type="text">
          进入项目视图
        </Button>
      </div>
    </div>
  );
}
