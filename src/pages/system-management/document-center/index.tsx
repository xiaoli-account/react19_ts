/** @format */

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Table,
  Drawer,
  message,
  Tag,
  Select,
  Spin,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  DocumentService,
  type DocumentRecord,
} from "@/services/document-center-service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TablePaginationConfig } from "antd/es/table";
import { LeeLogger } from "@/layout/utils/leeLogger";

/**
 * 文档中心页面
 * 展示项目文档和 AI 文档，并提供预览功能
 */
const DocumentCenter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<DocumentRecord[]>([]); // 所有数据
  const [data, setData] = useState<DocumentRecord[]>([]); // 展示数据
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条数据`,
  });

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 文档查看
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<DocumentRecord | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(false);

  const documentService = new DocumentService();

  // 获取文档列表
  const fetchDocList = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await documentService.getDocuments();
      setAllData(docs);
      // 初始显示所有数据
      filterData(docs);
    } catch (error) {
      console.error("获取文档列表失败", error);
      message.error("获取文档列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 过滤数据(前端搜索)
  const filterData = (
    sourceData: DocumentRecord[],
    page = 1,
    pageSize = 10,
    searchValues?: { name?: string; type?: string }
  ) => {
    const values = searchValues || {};
    let filtered = [...sourceData];

    if (values.name) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(values.name!.toLowerCase())
      );
    }

    if (values.type) {
      filtered = filtered.filter((item) => item.type === values.type);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedData = filtered.slice(startIndex, endIndex);

    setData(pagedData);
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
      total: total,
    }));
  };

  // 初始化加载
  useEffect(() => {
    fetchDocList();
  }, [fetchDocList]);

  // 处理搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    filterData(allData, 1, pagination.pageSize, values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    filterData(allData, 1, pagination.pageSize, {});
  };

  // 表格变化处理
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const values = searchForm.getFieldsValue();
    filterData(allData, newPagination.current, newPagination.pageSize, values);
  };

  // 查看文档
  const handleView = async (record: DocumentRecord) => {
    LeeLogger.info("用户查看" + record.name + "文档", record);
    setCurrentDoc(record);
    setDrawerVisible(true);
    setContentLoading(true);
    try {
      const content = await record.contentLoader();
      setDocContent(content);
    } catch (error) {
      console.error("加载文档内容失败", error);
      message.error("加载文档内容失败");
      setDocContent("加载失败");
    } finally {
      setContentLoading(false);
    }
  };

  // 文档类型标签渲染
  const renderTypeTag = (type: string) => {
    return type === "Project" ? (
      <Tag color="blue">项目文档</Tag>
    ) : (
      <Tag color="purple">AI 文档</Tag>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      key: "index",
      align: "center" as const,
      width: 80,
      render: (_: unknown, __: DocumentRecord, index: number) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "文档名称",
      dataIndex: "name",
      key: "name",
      align: "left" as const,
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      width: 120,
      render: (type: string) => renderTypeTag(type),
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
      align: "left" as const,
      ellipsis: true,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      align: "center" as const,
      width: 120,
      render: (_: unknown, record: DocumentRecord) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<ReadOutlined />}
          onClick={() => handleView(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 顶部搜索栏 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="name" label="文档名称">
              <Input placeholder="请输入文档名称" allowClear />
            </Form.Item>
            <Form.Item name="type" label="文档类型">
              <Select
                placeholder="请选择类型"
                allowClear
                style={{ width: 150 }}
              >
                <Select.Option value="Project">项目文档</Select.Option>
                <Select.Option value="AI">AI 文档</Select.Option>
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
            scroll={{ x: 800 }}
          />
        </Card>
      </Space>

      {/* 文档查看抽屉 */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            {currentDoc?.name}
            {currentDoc && renderTypeTag(currentDoc.type)}
          </Space>
        }
        placement="right"
        size="large"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose
        zIndex={10000}
      >
        <Spin spinning={contentLoading}>
          <div className="prose prose-slate max-w-none p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {docContent}
            </ReactMarkdown>
          </div>
        </Spin>
      </Drawer>
    </div>
  );
};

export default DocumentCenter;
