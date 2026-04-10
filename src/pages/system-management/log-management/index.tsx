/** @format */

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Modal,
  Drawer,
  Badge,
  Descriptions,
  Empty,
  Typography,
  Popconfirm,
  Dropdown,
} from "antd";
import type { PresetStatusColorType } from "antd/es/_util/colors";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ClearOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  LeeLogger,
  LOG_LEVEL,
  LOG_TYPE,
  OPERATION_STATUS,
} from "@/layout/utils/leeLogger";
import type { LogRecord } from "@/layout/utils/leeLogger";
import { message } from "@/utils/globalAntd";

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

interface SearchFormValues {
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  level?: string;
  type?: string;
  module?: string;
  operation?: string;
  keyword?: string;
}

/**
 * 日志管理页面
 */
const LogManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LogRecord[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<LogRecord | null>(null);

  // 搜索表单
  const [form] = Form.useForm();

  // 获取日志数据
  const fetchLogs = useCallback(() => {
    setLoading(true);
    // 模拟网络延迟，提升体验
    setTimeout(() => {
      try {
        const logs = LeeLogger.getLogs();
        // 按时间倒序排列
        setData([...logs].reverse());
      } catch {
        message.error("获取日志失败");
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 处理搜索
  const handleSearch = (values: SearchFormValues) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const allLogs = LeeLogger.getLogs();
        const { timeRange, level, type, module, operation, keyword } = values;

        const filtered = allLogs.filter((log) => {
          let match = true;

          // 时间范围筛选
          if (timeRange && timeRange.length === 2) {
            const start = timeRange[0].valueOf();
            const end = timeRange[1].valueOf();
            if (log.timestamp < start || log.timestamp > end) match = false;
          }

          // 级别筛选
          if (match && level && log.level !== level) match = false;

          // 类型筛选
          if (match && type && log.type !== type) match = false;

          // 模块筛选 (模糊匹配)
          if (match && module && !log.module?.includes(module)) match = false;

          // 操作筛选 (模糊匹配)
          if (match && operation && !log.operation?.includes(operation))
            match = false;

          // 关键词综合筛选
          if (match && keyword) {
            const kw = keyword.toLowerCase();
            const msgMatch = log.message.toLowerCase().includes(kw);
            const userMatch = log.userName?.toLowerCase().includes(kw);
            const ipMatch =
              log.publicIP?.includes(kw) || log.localIP?.includes(kw);
            if (!msgMatch && !userMatch && !ipMatch) match = false;
          }

          return match;
        });

        setData(filtered.reverse());
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    fetchLogs();
  };

  // 删除单条
  const handleDelete = (record: LogRecord) => {
    LeeLogger.deleteLogs([record.timestamp]);
    message.success("删除成功");
    fetchLogs(); // 重新获取
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 条日志吗？`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        // selectedRowKeys 在这里假设是 timestamp (rowKey 设置为 timestamp)
        // 注意：timestamp 可能重复，这在极端高并发下是个问题，但对于前端日志一般够用。
        // 如果有 ID 字段更好，LeeLogger 生成时没有 uuid。
        // 暂时假设 key 对应 timestamp
        const timestamps = selectedRowKeys.map((key) => Number(key));
        LeeLogger.deleteLogs(timestamps);
        message.success("批量删除成功");
        setSelectedRowKeys([]);
        fetchLogs();
      },
    });
  };

  // 清空所有
  const handleClearAll = () => {
    LeeLogger.clearLogs();
    message.success("日志已清空");
    fetchLogs();
  };

  // 下载日志
  const handleDownload = (format: "json" | "text") => {
    LeeLogger.downloadLogs(format);
    message.success("开始下载");
  };

  // 查看详情
  const showDetail = (record: LogRecord) => {
    let logName = record.module || record.timestamp;
    LeeLogger.info("用户查看" + logName + "日志", record);
    setCurrentLog(record);
    setDetailVisible(true);
  };

  // 级别颜色映射
  const getLevelColor = (level: string) => {
    switch (level) {
      case LOG_LEVEL.DEBUG:
        return "default";
      case LOG_LEVEL.INFO:
        return "processing";
      case LOG_LEVEL.WARN:
        return "warning";
      case LOG_LEVEL.ERROR:
        return "error";
      case LOG_LEVEL.FATAL:
        return "#f50";
      default:
        return "default";
    }
  };

  // 状态颜色映射
  const getStatusColor = (status?: string): PresetStatusColorType => {
    switch (status) {
      case OPERATION_STATUS.SUCCESS:
        return "success";
      case OPERATION_STATUS.FAILURE:
        return "error";
      case OPERATION_STATUS.PENDING:
        return "processing";
      default:
        return "default";
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      key: "index",
      width: 80,
      align: "center" as const,
      fixed: "left" as const,
      render: (_: unknown, __: LogRecord, index: number) => index + 1,
    },
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
      fixed: "left" as const,
      sorter: (a: LogRecord, b: LogRecord) => a.timestamp - b.timestamp,
    },
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      width: 100,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level.toUpperCase()}</Tag>
      ),
      filters: Object.values(LOG_LEVEL).map((l) => ({ text: l, value: l })),
      onFilter: (value: React.Key | boolean, record: LogRecord) =>
        record.level === value,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color="cyan">{type?.toUpperCase() || "METHOD"}</Tag>
      ),
      filters: Object.values(LOG_TYPE).map((t) => ({ text: t, value: t })),
      onFilter: (value: React.Key | boolean, record: LogRecord) =>
        record.type === value,
    },
    {
      title: "模块",
      dataIndex: "module",
      key: "module",
      width: 120,
      render: (text: string) => (text ? <Tag color="blue">{text}</Tag> : "-"),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 120,
      render: (text: string) => (text ? <Text strong>{text}</Text> : "-"),
    },
    {
      title: "内容",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      width: 200,
    },
    {
      title: "用户",
      dataIndex: "userName",
      key: "userName",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) =>
        status ? <Badge status={getStatusColor(status)} text={status} /> : "-",
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: unknown, record: LogRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定删除这条日志吗？"
            onConfirm={() => handleDelete(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 下载菜单
  const downloadItems = [
    {
      key: "json",
      label: "导出 JSON",
      icon: <FileTextOutlined />, // Using FileText as proxy for JSON icon if FileJson not available
      onClick: () => handleDownload("json"),
    },
    {
      key: "text",
      label: "导出 文本",
      icon: <FileTextOutlined />,
      onClick: () => handleDownload("text"),
    },
  ];

  return (
    <div>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 搜索区域 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{ rowGap: 16 }}
          >
            <Form.Item name="timeRange" label="时间范围">
              <RangePicker showTime />
            </Form.Item>
            <Form.Item name="level" label="日志级别">
              <Select placeholder="选择级别" allowClear>
                {Object.values(LOG_LEVEL).map((level) => (
                  <Select.Option key={level} value={level}>
                    {level.toUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="type" label="日志类型">
              <Select placeholder="选择类型" allowClear>
                {Object.values(LOG_TYPE).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type.toUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="module" label="模块">
              <Input placeholder="输入模块名" allowClear />
            </Form.Item>
            <Form.Item name="keyword" label="关键词">
              <Input
                placeholder="搜索消息/用户"
                allowClear
                prefix={<SearchOutlined className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 数据列表区域 */}
        <Card
          variant="borderless"
          className="shadow-sm rounded-lg"
          styles={{
            body: {
              paddingTop: 16,
              paddingBottom: 0,
              paddingLeft: 16,
              paddingRight: 16,
            },
          }}
        >
          <div className="flex justify-between mb-4">
            <Space>
              <Button
                danger
                disabled={selectedRowKeys.length === 0}
                onClick={handleBatchDelete}
                icon={<DeleteOutlined />}
              >
                批量删除
              </Button>
            </Space>

            <Space>
              <Dropdown menu={{ items: downloadItems }}>
                <Button icon={<DownloadOutlined />}>导出日志</Button>
              </Dropdown>
              <Popconfirm
                title="确定要清空所有日志吗？"
                description="此操作不可恢复！"
                onConfirm={handleClearAll}
                okText="确定清空"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<ClearOutlined />}>
                  清空日志
                </Button>
              </Popconfirm>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchLogs}
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </div>

          <Table
            rowKey={(record) => record.timestamp + (record.message || "")} // 组合Key避免时间戳重复
            columns={columns}
            dataSource={data}
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条日志`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Space>

      {/* 详情抽屉 */}
      <Drawer
        title="日志详情"
        placement="right"
        size="large"
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {currentLog ? (
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="日志ID">
                {currentLog.timestamp}
              </Descriptions.Item>
              <Descriptions.Item label="时间">
                {currentLog.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="级别">
                <Tag color={getLevelColor(currentLog.level)}>
                  {currentLog.level.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color="cyan">
                  {currentLog.type?.toUpperCase() || "METHOD"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="模块">
                {currentLog.module || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="操作">
                {currentLog.operation || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="用户">
                {currentLog.userName} (ID: {currentLog.userId})
              </Descriptions.Item>
              <Descriptions.Item label="公网IP">
                {currentLog.publicIP || "未知"}
              </Descriptions.Item>
              <Descriptions.Item label="局域网IP">
                {currentLog.localIP || "未知"}
              </Descriptions.Item>
              <Descriptions.Item label="浏览器">
                {currentLog.computer?.browser}{" "}
                {currentLog.computer?.browserVersion}
              </Descriptions.Item>
              <Descriptions.Item label="操作系统">
                {currentLog.computer?.os}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentLog.status)}
                  text={currentLog.status || "未知"}
                />
              </Descriptions.Item>
            </Descriptions>

            <Card title="日志内容" size="small" type="inner">
              <Paragraph>
                <pre
                  style={{
                    display: "block",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    maxHeight: "200px",
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {currentLog.message}
                </pre>
              </Paragraph>
            </Card>

            {currentLog.data && (
              <Card title="附加数据" size="small" type="inner">
                <pre
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {JSON.stringify(currentLog.data, null, 2)}
                </pre>
              </Card>
            )}

            {currentLog.stack && (
              <Card
                title="错误堆栈"
                size="small"
                type="inner"
                headStyle={{ color: "#ff4d4f" }}
              >
                <div
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    color: "#ff4d4f",
                    background: "#fff1f0",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {currentLog.stack}
                </div>
              </Card>
            )}
          </Space>
        ) : (
          <Empty description="未选择日志" />
        )}
      </Drawer>
    </div>
  );
};

export default LogManagement;
