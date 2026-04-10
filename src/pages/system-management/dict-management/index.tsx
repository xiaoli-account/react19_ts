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
  DatePicker,
  Row,
  Col,
  Radio,
  Tooltip,
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
  SyncOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, TableProps } from "antd";
import type { Key } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface DictTypeRecord {
  dictId: string;
  dictName: string;
  dictType: string;
  status: string; // "0":正常 "1":停用
  remark: string;
  createTime: string;
}

// 模拟数据
const MOCK_DICT_TYPES: DictTypeRecord[] = [
  {
    dictId: "1",
    dictName: "用户性别",
    dictType: "sys_user_sex",
    status: "0",
    remark: "用户性别列表",
    createTime: "2026-01-18 10:58:21",
  },
  {
    dictId: "2",
    dictName: "菜单状态",
    dictType: "sys_show_hide",
    status: "0",
    remark: "菜单状态列表",
    createTime: "2026-01-18 10:58:21",
  },
  {
    dictId: "3",
    dictName: "系统开关",
    dictType: "sys_normal_disable",
    status: "0",
    remark: "系统开关列表",
    createTime: "2026-01-18 10:58:21",
  },
  {
    dictId: "4",
    dictName: "任务状态",
    dictType: "sys_job_status",
    status: "0",
    remark: "任务状态列表",
    createTime: "2026-01-18 10:58:21",
  },
  {
    dictId: "6",
    dictName: "系统是否",
    dictType: "sys_yes_no",
    status: "0",
    remark: "系统是否列表",
    createTime: "2026-01-18 10:58:21",
  },
  {
    dictId: "7",
    dictName: "通知类型",
    dictType: "sys_notice_type",
    status: "0",
    remark: "通知类型列表",
    createTime: "2026-01-18 10:58:21",
  },
];

const DictManagement: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictTypeRecord[]>([]);
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
  const [currentRecord, setCurrentRecord] = useState<DictTypeRecord | null>(
    null
  );

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData([...MOCK_DICT_TYPES]);
      setPagination((prev) => ({ ...prev, total: MOCK_DICT_TYPES.length }));
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    fetchData();
    message.success("查询成功");
  };

  const handleReset = () => {
    searchForm.resetFields();
    fetchData();
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 跳转到字典数据
  const handleToDictData = (record: DictTypeRecord) => {
    navigate(
      `/system-management/dict-data?dictId=${record.dictId}&dictType=${record.dictType}`
    );
  };

  const openModal = (type: "add" | "edit", record?: DictTypeRecord) => {
    setModalType(type);
    setCurrentRecord(record || null);
    setModalVisible(true);

    setTimeout(() => {
      modalForm.resetFields();
      if (type === "edit" && record) {
        modalForm.setFieldsValue({
          ...record,
        });
      } else {
        modalForm.setFieldsValue({
          status: "0",
        });
      }
    }, 0);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      console.log("Submit Dict:", values);
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
      content: `是否确认删除字典编号为"${ids.join(",")}"的数据项？`,
      onOk: () => {
        message.success("删除成功");
        fetchData();
        setSelectedRowKeys([]);
      },
    });
  };

  const handleRefreshCache = () => {
    message.success("刷新缓存成功");
  };

  const columns: TableProps<DictTypeRecord>["columns"] = [
    {
      title: "字典编号",
      dataIndex: "dictId",
      key: "dictId",
      align: "center",
      width: 100,
    },
    {
      title: "字典名称",
      dataIndex: "dictName",
      key: "dictName",
      align: "center",
    },
    {
      title: "字典类型",
      dataIndex: "dictType",
      key: "dictType",
      align: "center",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => handleToDictData(record)}
          style={{ padding: 0 }}
        >
          {text}
        </Button>
      ),
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
            onClick={() => handleDelete([record.dictId])}
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
            <Form.Item name="dictName" label="字典名称">
              <Input placeholder="请输入字典名称" allowClear />
            </Form.Item>
            <Form.Item name="dictType" label="字典类型">
              <Input placeholder="请输入字典类型" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="字典状态" allowClear style={{ width: 120 }}>
                <Select.Option value="0">正常</Select.Option>
                <Select.Option value="1">停用</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="创建时间">
              <RangePicker style={{ width: 240 }} />
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
                    data.find((item) => item.dictId === selectedRowKeys[0])
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
                icon={<SyncOutlined />}
                onClick={handleRefreshCache}
              >
                刷新缓存
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
            rowKey="dictId"
            loading={loading}
            pagination={pagination}
          />
        </Card>
      </Space>

      {/* 弹窗 */}
      <Modal
        title={modalType === "add" ? "添加字典类型" : "修改字典类型"}
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
          <Form.Item
            label="字典名称"
            name="dictName"
            rules={[{ required: true, message: "请输入字典名称" }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            label="字典类型"
            name="dictType"
            rules={[{ required: true, message: "请输入字典类型" }]}
          >
            <Input placeholder="请输入字典类型" />
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

export default DictManagement;
