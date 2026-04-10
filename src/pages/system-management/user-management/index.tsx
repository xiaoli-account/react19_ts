/** @format */

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  Popconfirm,
  Avatar,
  Radio,
  Tag,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { UserService } from "@/services/user-service";
import type { TablePaginationConfig } from "antd/es/table";

// 定义用户接口
interface User {
  id: string;
  username: string; // 登录名
  name: string; // 姓名
  email: string | null; // 邮箱
  avatar?: string; // 头像
  password?: string;
  unitName?: string | null; // 单位名称
  roleNames?: string | null; // 角色名称
  phone?: string | null; // 电话
  status?: string | null; // 状态
  createTime?: string | null;
  imgUrl?: string | null; // 后端返回的头像字段
}

// 预设头像列表（为了效果更好，这里提供几个随机头像URL或使用Antd图标）
const AVATAR_LIST = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
];

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条用户`,
  });

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 编辑/新增表单
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [modalForm] = Form.useForm();
  const [currentId, setCurrentId] = useState<string | null>(null);

  const userService = new UserService();

  // 获取用户列表
  const fetchUserList = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      setLoading(true);
      try {
        const values = await searchForm.validateFields().catch(() => ({}));
        const params = {
          current: page,
          size: pageSize,
          ...values,
        };

        // 调用接口
        const res: any = await userService.pageList(params);

        if (res.success && res.data) {
          const { records, total, current, size } = res.data;
          setData(records || []);
          setPagination((prev) => ({
            ...prev,
            current: current,
            pageSize: size,
            total: total,
          }));
        } else {
          message.error(res.message || "获取用户列表失败");
        }
      } catch (error) {
        console.error("获取用户列表失败", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize, searchForm]
  );

  useEffect(() => {
    fetchUserList(1);
  }, []); // 初始化加载

  // 处理搜索
  const handleSearch = () => {
    fetchUserList(1);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchUserList(1);
  };

  // 表格变化处理（分页）
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUserList(newPagination.current, newPagination.pageSize);
  };

  // 打开模态框
  const openModal = (type: "add" | "edit", record?: User) => {
    setModalType(type);
    setModalVisible(true);
    if (type === "edit" && record) {
      setCurrentId(record.id);
      modalForm.setFieldsValue(record);
    } else {
      setCurrentId(null);
      modalForm.resetFields();
      // 默认选中第一个头像
      modalForm.setFieldValue("avatar", AVATAR_LIST[0]);
    }
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      const payload = { ...values, id: currentId };

      await userService.saveOrUpdateUser(payload);
      message.success(modalType === "add" ? "新增成功" : "更新成功");
      setModalVisible(false);
      fetchUserList(); // 刷新列表
    } catch (error) {
      console.error("保存失败", error);
    }
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUserCascade(id);
      message.success("删除成功");
      fetchUserList();
    } catch (error) {
      console.error("删除失败", error);
    }
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      align: "center" as const,
      width: 80,
      render: (_: unknown, __: User, index: number) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "登录名",
      dataIndex: "username",
      key: "username",
      align: "left" as const,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "left" as const,
      render: (text: string, record: User) => (
        <Space>
          {record.avatar || record.imgUrl ? (
            <Avatar src={record.avatar || record.imgUrl || undefined} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )}
          {text}
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "left" as const,
      render: (status: string) => {
        return status === "0" ? (
          <Tag color="green">正常</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        );
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      align: "left" as const,
    },
    {
      title: "操作",
      key: "action",
      align: "center" as const,
      width: 200,
      render: (_: unknown, record: User) => {
        if (record.username === "admin") {
          return <Tag color="gold">系统账号</Tag>;
        }
        return (
          <Space>
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => openModal("edit", record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除此用户吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="">
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 顶部搜索栏 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="username" label="登录名">
              <Input placeholder="请输入登录名" allowClear />
            </Form.Item>
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入姓名" allowClear />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  icon={<PlusOutlined />}
                  onClick={() => openModal("add")}
                >
                  新增
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 表格区域 */}
        <Card
          variant="borderless"
          className="shadow-sm rounded-lg"
          styles={{ body: { padding: " 16px 16px 0 16px" } }}
        >
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </Card>
      </Space>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === "add" ? "新增用户" : "编辑用户"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnHidden
      >
        <Form
          form={modalForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ avatar: AVATAR_LIST[0] }}
        >
          {/* 头像选择 */}
          <Form.Item label="头像" name="avatar">
            <Radio.Group>
              <Space wrap>
                {AVATAR_LIST.map((url) => (
                  <Radio value={url} key={url} className="mb-2">
                    <Avatar
                      src={url}
                      size="large"
                      className="border border-gray-200"
                    />
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="登录账号"
            name="loginName"
            rules={[{ required: true, message: "请输入登录账号" }]}
          >
            <Input
              placeholder="请输入登录账号"
              disabled={modalType === "edit"}
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {modalType === "add" && (
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入初始密码" }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
