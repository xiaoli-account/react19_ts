/** @format */

import { Table, Button, Space, Tag } from "antd";

const TableExample = () => {
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "张三",
      age: 32,
      address: "北京市朝阳区",
      tags: ["开发", "前端"],
    },
    {
      key: "2",
      name: "李四",
      age: 42,
      address: "上海市浦东新区",
      tags: ["设计", "UI"],
    },
    {
      key: "3",
      name: "王五",
      age: 28,
      address: "广州市天河区",
      tags: ["测试", "QA"],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">表格示例</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default TableExample;
