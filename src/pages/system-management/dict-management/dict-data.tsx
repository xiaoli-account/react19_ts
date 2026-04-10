/** @format */

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Table,
  Modal,
  message,
  Tag,
  Select,
  Row,
  Col,
  Radio,
  InputNumber,
  theme,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, TableProps } from "antd";
import type { Key } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useSearchParams, useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface DictDataRecord {
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  status: string; // "0":正常 "1":停用
  remark: string;
  createTime: string;
  listClass?: string; // default, primary, success, info, warning, danger
  cssClass?: string;
}

// 模拟字典类型选项
const MOCK_DICT_OPTIONS = [
  { label: "用户性别", value: "sys_user_sex" },
  { label: "菜单状态", value: "sys_show_hide" },
  { label: "系统开关", value: "sys_normal_disable" },
  { label: "任务状态", value: "sys_job_status" },
  { label: "系统是否", value: "sys_yes_no" },
  { label: "通知类型", value: "sys_notice_type" },
];

// 模拟字典数据
const MOCK_DICT_DATA: DictDataRecord[] = [
  {
    dictCode: "1",
    dictLabel: "男",
    dictValue: "0",
    dictSort: 1,
    status: "0",
    remark: "性别男",
    createTime: "2026-01-18 10:58:22",
    listClass: "default",
  },
  {
    dictCode: "2",
    dictLabel: "女",
    dictValue: "1",
    dictSort: 2,
    status: "0",
    remark: "性别女",
    createTime: "2026-01-18 10:58:22",
    listClass: "default",
  },
  {
    dictCode: "3",
    dictLabel: "未知",
    dictValue: "2",
    dictSort: 3,
    status: "0",
    remark: "性别未知",
    createTime: "2026-01-18 10:58:22",
    listClass: "default",
  },
  {
    dictCode: "28",
    dictLabel: "成功",
    dictValue: "0",
    dictSort: 1,
    status: "0",
    remark: "正常状态",
    createTime: "2026-01-18 10:58:22",
    listClass: "primary",
  },
  {
    dictCode: "29",
    dictLabel: "失败",
    dictValue: "1",
    dictSort: 2,
    status: "0",
    remark: "停用状态",
    createTime: "2026-01-18 10:58:22",
    listClass: "danger",
  },
];

const DictData: React.FC = () => {
  const { token } = theme.useToken();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 从URL参数获取默认字典类型
  const defaultDictType = searchParams.get("dictType") || "sys_user_sex";

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictDataRecord[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  });

  // 选中行
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 模态框
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [modalForm] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<DictDataRecord | null>(
    null
  );

  const fetchData = () => {
    setLoading(true);
    // 实际应根据 searchForm 的 dictType 过滤
    // 这里简单根据默认 mock 数据返回
    setTimeout(() => {
      // 简单模拟根据URL dictType 筛选数据（如果 MOCK 数据够多的话，这里仅展示部分）
      // 为演示效果，默认展示所有 MOCK 数据
      setData([...MOCK_DICT_DATA]);
      setPagination((prev) => ({ ...prev, total: MOCK_DICT_DATA.length }));
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // 设置搜索表单默认值
    searchForm.setFieldsValue({
      dictType: defaultDictType,
    });
    fetchData();
  }, [defaultDictType]); // 依赖 defaultDictType，当 URL 变化时刷新

  const handleSearch = () => {
    fetchData();
    message.success("查询成功");
  };

  const handleReset = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue({ dictType: defaultDictType }); // reset 后保持当前字典类型
    fetchData();
  };

  const handleClose = () => {
    // 返回字典管理页面
    navigate("/system-management/dict-management");
    // 或者 navigate(-1)
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const openModal = (type: "add" | "edit", record?: DictDataRecord) => {
    setModalType(type);
    setCurrentRecord(record || null);
    setModalVisible(true);

    setTimeout(() => {
      modalForm.resetFields();
      const currentDictType = searchForm.getFieldValue("dictType");
      if (type === "edit" && record) {
        modalForm.setFieldsValue({
          ...record,
          dictType: currentDictType, // 保持字典类型一致
        });
      } else {
        modalForm.setFieldsValue({
          dictType: currentDictType,
          dictSort: 0,
          status: "0",
          listClass: "default",
        });
      }
    }, 0);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      console.log("Submit Dict Data:", values);
      message.success(modalType === "add" ? "新增成功" : "修改成功");
      setModalVisible(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (ids: Key[]) => {
    Modal.confirm({
      title: "系统提示",
      content: `是否确认删除字典编码为"${ids.join(",")}"的数据项？`,
      onOk: () => {
        message.success("删除成功");
        fetchData();
        setSelectedRowKeys([]);
      },
    });
  };

  const columns: TableProps<DictDataRecord>["columns"] = [
    {
      title: "字典编码",
      dataIndex: "dictCode",
      key: "dictCode",
      align: "center",
      width: 100,
    },
    {
      title: "字典标签",
      dataIndex: "dictLabel",
      key: "dictLabel",
      align: "center",
      render: (text, record) => {
        let color = "default";
        if (record.listClass === "primary") color = "blue";
        if (record.listClass === "success") color = "success";
        if (record.listClass === "info") color = "processing";
        if (record.listClass === "warning") color = "warning";
        if (record.listClass === "danger") color = "error";
        if (record.listClass === "default" || !record.listClass) return text;

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "字典键值",
      dataIndex: "dictValue",
      key: "dictValue",
      align: "center",
    },
    {
      title: "字典排序",
      dataIndex: "dictSort",
      key: "dictSort",
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status) => (
        <Tag color={status === "0" ? "blue" : "error"}>
          {status === "0" ? "正常" : "停用"}
        </Tag>
      ),
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
          >
            修改
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete([record.dictCode])}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 搜索栏 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="dictType" label="字典名称">
              <Select
                placeholder="请选择字典名称"
                style={{ width: 200 }}
                options={MOCK_DICT_OPTIONS}
              />
            </Form.Item>
            <Form.Item name="dictLabel" label="字典标签">
              <Input placeholder="请输入字典标签" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="数据状态" allowClear style={{ width: 120 }}>
                <Select.Option value="0">正常</Select.Option>
                <Select.Option value="1">停用</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 表格区 */}
        <Card
          variant="borderless"
          className="shadow-sm rounded-lg"
          styles={{ body: { padding: "16px" } }}
        >
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal("add")}
              >
                新增
              </Button>
              <Button
                type="primary"
                disabled={selectedRowKeys.length !== 1}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                icon={<EditOutlined />}
                onClick={() =>
                  openModal(
                    "edit",
                    data.find((item) => item.dictCode === selectedRowKeys[0])
                  )
                }
              >
                修改
              </Button>
              <Button
                type="primary"
                danger
                disabled={selectedRowKeys.length === 0}
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(selectedRowKeys)}
              >
                删除
              </Button>
              <Button type="dashed" icon={<DownloadOutlined />}>
                导出
              </Button>
              <Button
                type="dashed"
                danger
                icon={<CloseOutlined />}
                onClick={handleClose}
              >
                关闭
              </Button>
            </Space>
            <Space style={{ float: "right" }}>
              {/* <Button shape="circle" icon={<SearchOutlined />} /> */}
              {/* <Button shape="circle" icon={<ReloadOutlined />} onClick={fetchData} /> */}
            </Space>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowKey="dictCode"
            loading={loading}
            pagination={pagination}
          />
        </Card>
      </Space>

      {/* 弹窗 */}
      <Modal
        title={modalType === "add" ? "添加字典数据" : "修改字典数据"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
        destroyOnHidden
      >
        <Form
          form={modalForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item label="字典类型" name="dictType">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="数据标签"
            name="dictLabel"
            rules={[{ required: true, message: "请输入数据标签" }]}
          >
            <Input placeholder="请输入数据标签" />
          </Form.Item>
          <Form.Item
            label="数据键值"
            name="dictValue"
            rules={[{ required: true, message: "请输入数据键值" }]}
          >
            <Input placeholder="请输入数据键值" />
          </Form.Item>
          <Form.Item label="样式属性" name="cssClass">
            <Input placeholder="请输入样式属性" />
          </Form.Item>
          <Form.Item
            label="显示排序"
            name="dictSort"
            rules={[{ required: true, message: "请输入排序" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="回显样式" name="listClass">
            <Select>
              <Select.Option value="default">默认</Select.Option>
              <Select.Option value="primary">主要</Select.Option>
              <Select.Option value="success">成功</Select.Option>
              <Select.Option value="info">信息</Select.Option>
              <Select.Option value="warning">警告</Select.Option>
              <Select.Option value="danger">危险</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictData;
