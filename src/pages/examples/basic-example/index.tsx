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
  Tag,
  Select,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ExampleService } from "@/services/example-service";
import type { TablePaginationConfig, TableProps } from "antd";

// 定义数据接口
interface DataRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  status: number; // 0-禁用 1-启用
  createTime?: string;
  updateTime?: string;
}

/**
 * CRUD 基础示例页面
 * 演示标准的增删改查功能实现
 */
const BasicExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataRecord[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条数据`,
  });

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 编辑/新增表单
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [modalForm] = Form.useForm();
  const [currentId, setCurrentId] = useState<string | null>(null);

  const exampleService = new ExampleService();

  // 获取数据列表
  const fetchDataList = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      setLoading(true);
      try {
        const values = await searchForm.validateFields().catch(() => ({}));
        const params = {
          current: page,
          size: pageSize,
          ...values,
        };

        // 调用 ExampleService
        const res: any = await exampleService.pageList(params);

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
          message.error(res.message || "获取数据失败");
        }
      } catch (error) {
        console.error("获取数据失败", error);
        message.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize, searchForm]
  );

  // 初始化加载
  useEffect(() => {
    fetchDataList(1);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    fetchDataList(1);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchDataList(1);
  };

  // 表格变化处理（分页）
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchDataList(newPagination.current, newPagination.pageSize);
  };

  // 打开模态框
  const openModal = (type: "add" | "edit", record?: DataRecord) => {
    setModalType(type);
    setModalVisible(true);
    setCurrentId(record?.id || null);

    // 解决 "Instance created by useForm is not connected to any Form element" 警告
    // 通过 setTimeout 确保在 Modal 渲染后再执行表单赋值操作
    setTimeout(() => {
      if (type === "edit" && record) {
        modalForm.setFieldsValue(record);
      } else {
        modalForm.resetFields();
        modalForm.setFieldsValue({ status: 1 });
      }
    }, 0);
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      const payload = { ...values, id: currentId };

      // 调用 ExampleService
      await exampleService.saveOrUpdate(payload);

      message.success(modalType === "add" ? "新增成功" : "更新成功");
      setModalVisible(false);
      fetchDataList(); // 刷新列表
    } catch (error) {
      console.error("保存失败", error);
    }
  };

  // 删除数据
  const handleDelete = async (id: string) => {
    try {
      // 调用 ExampleService
      await exampleService.delete(id);

      message.success("删除成功");
      fetchDataList();
    } catch (error) {
      console.error("删除失败", error);
      message.error("删除失败");
    }
  };

  // 状态标签渲染
  const renderStatusTag = (status: number) => {
    return status === 1 ? (
      <Tag color="success">启用</Tag>
    ) : (
      <Tag color="default">禁用</Tag>
    );
  };

  // 表格列定义
  const columns: TableProps<DataRecord>["columns"] = [
    {
      title: "序号",
      key: "index",
      align: "center" as const,
      width: 80,
      render: (_: unknown, __: DataRecord, index: number) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      align: "left" as const,
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code",
      align: "left" as const,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      align: "left" as const,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 100,
      render: (status: number) => renderStatusTag(status),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center" as const,
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right" as const,
      align: "center" as const,
      width: 200,
      render: (_: unknown, record: DataRecord) => (
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
            title="确定要删除此数据吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 顶部搜索栏 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
            <Form.Item name="code" label="编码">
              <Input placeholder="请输入编码" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: 120 }}
              >
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
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
          styles={{ body: { padding: "16px 16px 0 16px" } }}
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
        title={modalType === "add" ? "新增数据" : "编辑数据"}
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
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            label="编码"
            name="code"
            rules={[{ required: true, message: "请输入编码" }]}
          >
            <Input placeholder="请输入编码" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入描述"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BasicExample;
