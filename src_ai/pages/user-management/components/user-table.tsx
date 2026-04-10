/** @format */

import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { User } from "../types";

interface UserTableProps {
  data: User[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onTableChange: (pagination: TablePaginationConfig) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onTableChange,
}) => {
  const columns: ColumnsType<User> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        const roleMap: Record<string, { color: string; text: string }> = {
          admin: { color: "red", text: "管理员" },
          user: { color: "blue", text: "普通用户" },
          guest: { color: "default", text: "访客" },
        };
        const roleInfo = roleMap[role] || { color: "default", text: role };
        return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status === "active" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？"
            onConfirm={() => onDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      rowKey="id"
      scroll={{ x: 1200 }}
    />
  );
};

export default UserTable;
