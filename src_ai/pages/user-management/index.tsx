/** @format */

import React, { useState, useEffect } from "react";
import { Card, Button, Space, Input, Select, message } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import UserTable from "./components/user-table";
import UserForm from "./components/user-form";
import type { User, UserListParams, UserFormData } from "./types";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./types";
import { getUserList, createUser, updateUser, deleteUser } from "./services";
import "./styles.scss";

const UserManagement: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 查询参数
  const [queryParams, setQueryParams] = useState<UserListParams>({
    page: 1,
    pageSize: 10,
  });

  // 搜索表单
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState<string | undefined>(undefined);
  const [searchStatus, setSearchStatus] = useState<
    "active" | "inactive" | undefined
  >(undefined);

  // 加载用户列表
  const loadUserList = async () => {
    setLoading(true);
    try {
      const response = await getUserList(queryParams);
      setUserList(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      message.error("加载用户列表失败");
      console.error("加载用户列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和查询参数变化时重新加载
  useEffect(() => {
    loadUserList();
  }, [queryParams]);

  // 搜索
  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      page: 1,
      username: searchUsername || undefined,
      email: searchEmail || undefined,
      role: searchRole,
      status: searchStatus,
    });
  };

  // 重置搜索
  const handleReset = () => {
    setSearchUsername("");
    setSearchEmail("");
    setSearchRole(undefined);
    setSearchStatus(undefined);
    setQueryParams({
      page: 1,
      pageSize: 10,
    });
  };

  // 分页变化
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParams({
      ...queryParams,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
  };

  // 打开新建表单
  const handleAdd = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  // 打开编辑表单
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success("删除成功");
      loadUserList();
    } catch (error) {
      message.error("删除失败");
      console.error("删除用户失败:", error);
    }
  };

  // 提交表单
  const handleFormSubmit = async (values: UserFormData) => {
    try {
      if (editingUser) {
        // 编辑
        await updateUser(editingUser.id, values);
        message.success("更新成功");
      } else {
        // 新建
        await createUser(values);
        message.success("创建成功");
      }
      setFormOpen(false);
      loadUserList();
    } catch (error) {
      message.error(editingUser ? "更新失败" : "创建失败");
      console.error("提交表单失败:", error);
    }
  };

  return (
    <div className="user-management">
      {/* 搜索栏 */}
      <Card className="search-card">
        <Space wrap>
          <Input
            placeholder="用户名"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Input
            placeholder="邮箱"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="角色"
            value={searchRole}
            onChange={setSearchRole}
            options={[{ label: "全部", value: undefined }, ...ROLE_OPTIONS]}
            style={{ width: 150 }}
            allowClear
          />
          <Select
            placeholder="状态"
            value={searchStatus}
            onChange={setSearchStatus}
            options={[{ label: "全部", value: undefined }, ...STATUS_OPTIONS]}
            style={{ width: 150 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Card>

      {/* 操作栏 */}
      <Card className="action-card">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建用户
          </Button>
        </Space>
      </Card>

      {/* 用户表格 */}
      <Card>
        <UserTable
          data={userList}
          loading={loading}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTableChange={handleTableChange}
        />
      </Card>

      {/* 用户表单 */}
      <UserForm
        open={formOpen}
        editingUser={editingUser}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default UserManagement;
