/** @format */

import React, { useState, useEffect, useMemo } from "react";
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
  InputNumber,
  Radio,
  TreeSelect,
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
  SwapOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  AppstoreOutlined,
  LinkOutlined,
  SendOutlined,
  DesktopOutlined,
  InboxOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, TableProps } from "antd";
import type { Key } from "antd/es/table/interface";
import dayjs from "dayjs";
import * as Icons from "@ant-design/icons";

import { asyncRoutes } from "@/router/routes";
import type { RouteItem } from "@/layout/router/router-type";

// 定义菜单数据结构
interface MenuRecord {
  id: string;
  parentId?: string;
  menuName: string;
  icon?: string;
  orderNum: number;
  path?: string;
  component?: string;
  menuType: "M" | "C" | "F"; // M:目录 C:菜单 F:按钮
  visible: string; // "0":显示 "1":隐藏
  status: string; // "0":正常 "1":停用
  perms?: string;
  createTime: string;
  children?: MenuRecord[];
}

// 递归转换路由配置为菜单数据
const transformRoutes = (
  routes: RouteItem[],
  parentId?: string
): MenuRecord[] => {
  if (!routes) return [];
  return routes
    .filter((route) => !route.meta?.hidden) // 过滤隐藏路由
    .map((route, index) => {
      const id = route.name || route.path;
      const menuType = route.children && route.children.length > 0 ? "M" : "C";

      const record: MenuRecord = {
        id: id,
        parentId: parentId,
        menuName: route.meta?.title || route.name || "",
        icon: route.meta?.icon,
        orderNum: index + 1,
        path: route.path,
        component: "Layout", // 暂时硬编码或需要从路由对象推断
        menuType: menuType,
        visible: route.meta?.hidden ? "1" : "0",
        status: "0",
        perms: route.meta?.pagePermission,
        createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        children: route.children
          ? transformRoutes(route.children, id)
          : undefined,
      };
      return record;
    });
};

// 图标渲染辅助
const renderIcon = (iconName?: string) => {
  if (!iconName) return null;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <AppstoreOutlined />;
};

const MenuManagement: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MenuRecord[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [isExpandAll, setIsExpandAll] = useState(false);

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 模态框
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [modalForm] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<MenuRecord | null>(null);

  // 获取所有 Key 用于展开/折叠
  const getAllKeys = (data: MenuRecord[]) => {
    let keys: Key[] = [];
    data.forEach((item) => {
      keys.push(item.id);
      if (item.children) {
        keys = keys.concat(getAllKeys(item.children));
      }
    });
    return keys;
  };

  const fetchData = () => {
    setLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
      // 从 asyncRoutes 中提取 Layout 的子路由作为菜单根节点展示
      // 注意: asyncRoutes[0] 是 Layout, 也就是 dashboard 布局容器
      const layoutRoute =
        asyncRoutes.find((r) => r.name === "Layout") || asyncRoutes[0];
      const menuData = transformRoutes(layoutRoute?.children || []);
      setData(menuData);
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

  // 展开/折叠切换
  const toggleExpandAll = () => {
    if (isExpandAll) {
      setExpandedRowKeys([]);
    } else {
      setExpandedRowKeys(getAllKeys(data));
    }
    setIsExpandAll(!isExpandAll);
  };

  // 模态框操作
  const openModal = (type: "add" | "edit", record?: MenuRecord) => {
    setModalType(type);
    setCurrentRecord(record || null);
    setModalVisible(true);

    setTimeout(() => {
      modalForm.resetFields();
      if (type === "add") {
        // 如果是从行内点击"新增"，设置父级ID
        if (record) {
          modalForm.setFieldsValue({
            parentId: record.id,
            menuType: "C",
            status: "0",
            visible: "0",
            isFrame: "1",
            isCache: "0",
            orderNum: 0,
          });
        } else {
          modalForm.setFieldsValue({
            menuType: "M",
            status: "0",
            visible: "0",
            isFrame: "1",
            isCache: "0",
            orderNum: 0,
          });
        }
      } else if (record) {
        modalForm.setFieldsValue({
          ...record,
        });
      }
    }, 0);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      // 模拟保存
      console.log("Submit Menu:", values);
      message.success(modalType === "add" ? "新增成功" : "修改成功");
      setModalVisible(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (record: MenuRecord) => {
    message.success("删除成功");
    fetchData();
  };

  const columns: TableProps<MenuRecord>["columns"] = [
    {
      title: "菜单名称",
      dataIndex: "menuName",
      key: "menuName",
      width: 200,
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      align: "center",
      width: 80,
      render: (icon) => renderIcon(icon),
    },
    {
      title: "排序",
      dataIndex: "orderNum",
      key: "orderNum",
      align: "center",
      width: 80,
    },
    {
      title: "权限标识",
      dataIndex: "perms",
      key: "perms",
      width: 200,
      ellipsis: true,
    },
    {
      title: "组件路径",
      dataIndex: "component",
      key: "component",
      width: 200,
      ellipsis: true,
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
      width: 240,
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
            icon={<PlusOutlined />}
            onClick={() => openModal("add", record)}
          >
            新增
          </Button>
          <Popconfirm
            title="确定删除该菜单吗？"
            onConfirm={() => handleDelete(record)}
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
        {/* 搜索栏 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="menuName" label="菜单名称">
              <Input placeholder="请输入菜单名称" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="菜单状态" allowClear style={{ width: 120 }}>
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
              <Button icon={<SwapOutlined />} onClick={toggleExpandAll}>
                {isExpandAll ? "折叠" : "展开"}
              </Button>
            </Space>
            <Space style={{ float: "right" }}></Space>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={false}
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as Key[]),
            }}
          />
        </Card>
      </Space>

      {/* 弹窗 */}
      <Modal
        title={modalType === "add" ? "添加菜单" : "修改菜单"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={680}
        destroyOnHidden
      >
        <Form
          form={modalForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item label="上级菜单" name="parentId">
            <TreeSelect
              treeData={data}
              fieldNames={{
                label: "menuName",
                value: "id",
                children: "children",
              }}
              placeholder="选择上级菜单"
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>

          <Form.Item label="菜单类型" name="menuType">
            <Radio.Group>
              <Radio.Button value="M">目录</Radio.Button>
              <Radio.Button value="C">菜单</Radio.Button>
              <Radio.Button value="F">按钮</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev: any, curr: any) =>
              prev.menuType !== curr.menuType
            }
          >
            {({ getFieldValue }) => {
              const menuType = getFieldValue("menuType");
              return menuType !== "F" ? (
                <Form.Item label="菜单图标" name="icon">
                  <Input
                    placeholder="点击选择图标"
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="菜单名称"
                name="menuName"
                rules={[{ required: true, message: "请输入菜单名称" }]}
              >
                <Input placeholder="请输入菜单名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="显示排序"
                name="orderNum"
                rules={[{ required: true, message: "请输入排序" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prev: any, curr: any) =>
              prev.menuType !== curr.menuType
            }
          >
            {({ getFieldValue }) => {
              const menuType = getFieldValue("menuType");
              if (menuType !== "F") {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span>
                            是否外链&nbsp;
                            <Tooltip title="选择是外链则路由地址需要以`http(s)://`开头">
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </span>
                        }
                        name="isFrame"
                      >
                        <Radio.Group>
                          <Radio value="0">是</Radio>
                          <Radio value="1">否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="路由地址"
                        name="path"
                        rules={[
                          {
                            required: menuType !== "F",
                            message: "请输入路由地址",
                          },
                        ]}
                      >
                        <Input placeholder="请输入路由地址" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev: any, curr: any) =>
              prev.menuType !== curr.menuType
            }
          >
            {({ getFieldValue }) => {
              const menuType = getFieldValue("menuType");
              if (menuType === "C") {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="组件路径" name="component">
                        <Input placeholder="请输入组件路径" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="权限字符" name="perms">
                        <Input placeholder="请输入权限字符" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              if (menuType === "F") {
                return (
                  <Form.Item label="权限字符" name="perms">
                    <Input placeholder="请输入权限字符" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="显示状态" name="visible">
                <Radio.Group>
                  <Radio value="0">显示</Radio>
                  <Radio value="1">隐藏</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="菜单状态" name="status">
                <Radio.Group>
                  <Radio value="0">正常</Radio>
                  <Radio value="1">停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prev: any, curr: any) =>
              prev.menuType !== curr.menuType
            }
          >
            {({ getFieldValue }) => {
              const menuType = getFieldValue("menuType");
              if (menuType === "C") {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="是否缓存" name="isCache">
                        <Radio.Group>
                          <Radio value="0">缓存</Radio>
                          <Radio value="1">不缓存</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
