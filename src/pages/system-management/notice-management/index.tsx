/** @format */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Table,
  Modal,
  Popconfirm,
  Tag,
  Select,
  Radio,
  Badge,
  TreeSelect,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { NoticeService } from "@/services/notice-service";
import type { NoticeRecord } from "@/services/notice-service";
import type { TablePaginationConfig, TableProps } from "antd";
import { SimpleWebSocket, WebSocketState } from "@/layout/utils/websocket";
import { message } from "@/utils/globalAntd";
import LeeRichText from "@/layout/components/Lee-Rich-Text";

/**
 * 通知公告管理页面
 * 采用 Ajax + WebSocket 混合模式
 * - 普通CRUD操作使用 Ajax
 * - 消息类型的即时通知使用 WebSocket
 */
const NoticeManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NoticeRecord[]>([]);
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

  // WebSocket 实例
  const wsRef = useRef<SimpleWebSocket | null>(null);
  const [wsState, setWsState] = useState<WebSocketState>(WebSocketState.CLOSED);

  const noticeService = new NoticeService();

  // 初始化 WebSocket
  useEffect(() => {
    const ws = new SimpleWebSocket({
      url: "/ws/notice", // 假设 WebSocket 服务地址
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
    });

    ws.onStateChange((state) => {
      setWsState(state);
      console.log("WebSocket 状态变更:", state);
    });

    ws.onMessage((msg: any) => {
      console.log("收到 WebSocket 消息:", msg);
      if (msg.type === "new_notice") {
        message.info(`收到新通知: ${msg.data.title}`);
        fetchDataList(); // 收到新通知刷新列表
      }
    });

    ws.connect();
    wsRef.current = ws;

    return () => {
      ws.disconnect();
    };
  }, []);

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

        // 调用 Service
        const res: any = await noticeService.pageList(params);

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

        setLoading(false);
      } catch (error) {
        console.error("获取数据失败", error);
        message.error("获取数据失败");
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
  const openModal = (type: "add" | "edit", record?: NoticeRecord) => {
    setModalType(type);
    setModalVisible(true);
    setCurrentId(record?.id || null);

    setTimeout(() => {
      if (type === "edit" && record) {
        modalForm.setFieldsValue(record);
      } else {
        modalForm.resetFields();
        modalForm.setFieldsValue({
          status: 0,
          priority: "medium",
          type: "notification",
          receiverType: "all",
          content:
            '<h1 class=\"ql-align-center\">Quill富文本插件的封装进度</h1><p class=\"ql-align-right\">作者：小李同学</p><h3 class=\"ql-align-justify\">\tquill富文本插件到这里就已经集成结束，剩下的路交给组件自己吧！允许别人做别人，允许自己做自己，“相信”是给予他人最大的力量。</h3><p class=\"ql-align-justify\"><br></p><ol><li data-list=\"ordered\" class=\"ql-align-justify\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 153, 0);\">集成结束</span></li><li data-list=\"ordered\" class=\"ql-align-justify\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 153, 0);\">试用结束</span></li><li data-list=\"ordered\" class=\"ql-align-justify\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 153, 0);\">测试完成</span></li></ol><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><em>结尾</em>：<span style=\"color: rgb(0, 138, 0);\">山水有相逢，江湖再见！</span>🫡</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><strong>此致！</strong></p><p class=\"ql-align-right\"><span style=\"color: rgb(230, 0, 0);\">礼毕</span><span style=\"color: rgb(102, 163, 224);\">！</span></p>',
        });
      }
    }, 0);
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      const payload = { ...values, id: currentId };

      // 调用 Service
      await noticeService.saveOrUpdate(payload);

      if (
        values.type === "message" &&
        wsRef.current?.getState() === WebSocketState.OPEN
      ) {
        // 发送消息，Echo 服务会将其原样返回，从而触发 onMessage 中的处理逻辑
        wsRef.current.send(
          JSON.stringify({ type: "new_notice", data: payload })
        );
      }

      message.success(modalType === "add" ? "新增成功" : "更新成功");
      setModalVisible(false);
      fetchDataList();
    } catch (error) {
      console.error("保存失败", error);
    }
  };

  // 删除数据
  const handleDelete = async (id: string) => {
    try {
      await noticeService.delete(id);
      message.success("删除成功");
      fetchDataList();
    } catch (error) {
      console.error("删除失败", error);
      message.error("删除失败");
    }
  };

  // 发布/撤回状态
  const handleToggleStatus = async (record: NoticeRecord) => {
    const newStatus = record.status === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "发布" : "撤回";
    try {
      await noticeService.updateStatus(record.id, newStatus);
      message.success(`${actionText}成功`);
      fetchDataList();
    } catch (error) {
      message.error(`${actionText}失败`);
    }
  };

  // 渲染优先级标签
  const renderPriorityTag = (priority: string) => {
    const map: Record<string, { color: string; text: string }> = {
      low: { color: "blue", text: "低" },
      medium: { color: "orange", text: "中" },
      high: { color: "red", text: "高" },
    };
    const conf = map[priority] || { color: "default", text: "未知" };
    return <Tag color={conf.color}>{conf.text}</Tag>;
  };

  // 渲染类型标签
  const renderTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      notification: { color: "purple", text: "公告" },
      message: { color: "cyan", text: "消息" },
      event: { color: "green", text: "事件" },
    };
    const conf = map[type] || { color: "default", text: "未知" };
    return <Tag color={conf.color}>{conf.text}</Tag>;
  };

  // 表格列定义
  const columns: TableProps<NoticeRecord>["columns"] = [
    {
      title: "序号",
      key: "index",
      align: "center",
      width: 60,
      render: (_: unknown, __: NoticeRecord, index: number) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      align: "center",
      render: (type: string) => renderTypeTag(type),
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      align: "center",
      render: (priority: string) => renderPriorityTag(priority),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status: number) => (
        <Badge
          status={status === 1 ? "success" : "default"}
          text={status === 1 ? "已发布" : "草稿"}
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 160,
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      align: "center",
      width: 240,
      render: (_: unknown, record: NoticeRecord) => (
        <Space size="small">
          {record.status === 0 ? (
            <Button
              type="link"
              size="small"
              icon={<SendOutlined />}
              onClick={() => handleToggleStatus(record)}
            >
              发布
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<UndoOutlined />}
              onClick={() => handleToggleStatus(record)}
            >
              撤回
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
            disabled={record.status === 1} // 已发布不可编辑
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此公告吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
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
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" allowClear />
            </Form.Item>
            <Form.Item name="type" label="类型">
              <Select
                placeholder="请选择类型"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="notification">公告</Select.Option>
                <Select.Option value="message">消息</Select.Option>
                <Select.Option value="event">事件</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择状态"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value={1}>已发布</Select.Option>
                <Select.Option value={0}>草稿</Select.Option>
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
                  新增通知
                </Button>
                {/* WebSocket 状态指示 */}
                <Tag
                  color={wsState === WebSocketState.OPEN ? "success" : "error"}
                >
                  {wsState === WebSocketState.OPEN
                    ? "实时连接正常"
                    : "实时连接断开"}
                </Tag>
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
        title={modalType === "add" ? "新增通知公告" : "编辑通知公告"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnHidden
      >
        <Form
          form={modalForm}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: "请选择类型" }]}
          >
            <Radio.Group>
              <Radio value="notification">公告</Radio>
              <Radio value="message">消息 (WebSocket)</Radio>
              <Radio value="event">事件</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 针对【消息】类型的收信人动态分配层 */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.type !== curr.type}
          >
            {({ getFieldValue }) => {
              if (getFieldValue("type") !== "message") return null;

              return (
                <>
                  <Form.Item
                    label="接收范围"
                    name="receiverType"
                    rules={[{ required: true, message: "请选择消息推送范围" }]}
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="all">全员广播</Radio.Button>
                      <Radio.Button value="department">指定部门</Radio.Button>
                      <Radio.Button value="users">指定人员</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                      prev.receiverType !== curr.receiverType
                    }
                  >
                    {({ getFieldValue }) => {
                      const receiverType = getFieldValue("receiverType");
                      if (receiverType === "department") {
                        return (
                          <Form.Item
                            label="目标部门"
                            name="targetDepartments"
                            rules={[{ required: true, message: "请选择至少一个部门" }]}
                          >
                            <TreeSelect
                              treeCheckable={true}
                              showCheckedStrategy={TreeSelect.SHOW_PARENT}
                              placeholder="请以树形结构勾选要推送的部门"
                              treeDefaultExpandAll
                              treeData={[
                                {
                                  title: "总公司",
                                  value: "dept_root",
                                  children: [
                                    {
                                      title: "研发中心",
                                      value: "dept_rd",
                                      children: [
                                        { title: "前端部", value: "dept_rd_fe" },
                                        { title: "后端部", value: "dept_rd_be" },
                                      ],
                                    },
                                    {
                                      title: "产品中心",
                                      value: "dept_pd",
                                      children: [
                                        { title: "设计部", value: "dept_pd_ui" },
                                        { title: "产品部", value: "dept_pd_pm" },
                                      ],
                                    },
                                    { title: "综合行政部", value: "dept_admin" },
                                  ],
                                },
                              ]}
                            />
                          </Form.Item>
                        );
                      }
                      
                      if (receiverType === "users") {
                        return (
                          <Form.Item
                            label="具体人员"
                            name="targetUsers"
                            rules={[{ required: true, message: "请选择具体推送人员" }]}
                          >
                            <Select
                              mode="multiple"
                              placeholder="请选择需要接收通知的人（支持多选）"
                              options={[
                                { label: "林风", value: "user_01" },
                                { label: "苏沐", value: "user_02" },
                                { label: "叶修", value: "user_03" },
                              ]}
                            />
                          </Form.Item>
                        );
                      }
                      
                      return null;
                    }}
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <Form.Item label="优先级" name="priority">
            <Radio.Group>
              <Radio value="low">低</Radio>
              <Radio value="medium">中</Radio>
              <Radio value="high">高</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <LeeRichText placeholder="请输入通知详情内容（支持富文本排版）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
