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
  Popconfirm,
  Tag,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
  Radio,
  Checkbox,
  Tree,
  Tooltip,
  theme,
  Switch, // Added Switch
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, TableProps, TreeDataNode } from "antd";
import type { Key } from "antd/es/table/interface";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 定义数据接口
interface RoleRecord {
  id: string;
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: string; // "0"-启用 "1"-禁用 (matches RuoYi style usually, but lets use '0' active '1' inactive or boolean)
  // Actually usually in RuoYi: '0' is normal, '1' is disabled. Let's stick to simple strings or numbers.
  // Let's use '0' for Normal (Active), '1' for Disabled.
  createTime?: string;
  remark?: string;
  menuIds?: React.Key[];
}

// 模拟菜单数据
const MOCK_MENU_TREE: TreeDataNode[] = [
  {
    title: "系统管理",
    key: "1",
    children: [
      { title: "用户管理", key: "1-1" },
      { title: "角色管理", key: "1-2" },
      { title: "菜单管理", key: "1-3" },
      { title: "部门管理", key: "1-4" },
    ],
  },
  {
    title: "系统监控",
    key: "2",
    children: [
      { title: "在线用户", key: "2-1" },
      { title: "定时任务", key: "2-2" },
      { title: "数据监控", key: "2-3" },
      { title: "服务监控", key: "2-4" },
    ],
  },
  {
    title: "系统工具",
    key: "3",
    children: [
      { title: "表单构建", key: "3-1" },
      { title: "代码生成", key: "3-2" },
      { title: "系统接口", key: "3-3" },
    ],
  },
  {
    title: "若依官网",
    key: "4",
  },
];

// 模拟角色数据
const MOCK_ROLES: RoleRecord[] = [
  {
    id: "1",
    roleName: "超级管理员",
    roleKey: "admin",
    roleSort: 1,
    status: "0",
    createTime: "2026-01-18 10:58:15",
    remark: "超级管理员",
    menuIds: [
      "1",
      "1-1",
      "1-2",
      "1-3",
      "1-4",
      "2",
      "2-1",
      "2-2",
      "2-3",
      "2-4",
      "3",
      "3-1",
      "3-2",
      "3-3",
      "4",
    ],
  },
  {
    id: "2",
    roleName: "普通角色",
    roleKey: "common",
    roleSort: 2,
    status: "0",
    createTime: "2026-01-18 10:58:15",
    remark: "普通角色",
    menuIds: ["1", "1-1", "2"],
  },
];

/**
 * 角色管理页面
 */
const RoleManagement: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoleRecord[]>([]);
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

  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [modalForm] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<RoleRecord | null>(null);

  // 菜单树相关状态
  const [menuExpandAll, setMenuExpandAll] = useState(false);
  const [menuCheckAll, setMenuCheckAll] = useState(false);
  // checked = true表示开启联动（父子联动勾选状态），checkStrictly=false表示父子节点关联（tree组件功能开启）
  const [menuCheckStrictly, setMenuCheckStrictly] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // 已勾选tree的叶子节点key数组
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]); // 半选的tree父节点key的数组，用于提交后台时使用
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 获取所有 Key 用于全选/展开
  const allMenuKeys = useMemo(() => {
    const keys: React.Key[] = [];
    const traverse = (nodes: TreeDataNode[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) traverse(node.children);
      });
    };
    traverse(MOCK_MENU_TREE);
    return keys;
  }, []);

  /**
   * 根据已选 key 与菜单树结构推断 checkStrictly 状态
   * 判断依据：如果存在某个父节点被选中，但其所有子节点均未被选中，
   * 说明数据是在"非联动"模式下选择的，应开启 checkStrictly（取消父子联动）。
   * @param allKeys 后台返回的所有已选菜单 key
   * @param tree    菜单树数据
   */
  const inferMenuCheckStrictly = (
    allKeys: React.Key[],
    tree: TreeDataNode[]
  ): boolean => {
    const keySet = new Set(allKeys.map(String));

    /**
     * 递归检测：是否存在"父节点被选中但所有子节点均未被选中"的情况
     */
    const hasStrictlySelectedParent = (nodes: TreeDataNode[]): boolean => {
      return nodes.some((node) => {
        if (node.children && node.children.length > 0) {
          const parentSelected = keySet.has(String(node.key));
          const noChildSelected = node.children.every(
            (child) => !keySet.has(String(child.key))
          );
          if (parentSelected && noChildSelected) {
            return true;
          }
          return hasStrictlySelectedParent(node.children);
        }
        return false;
      });
    };

    /**
     * 从给定的 key 集合中筛选出叶子节点 key
     * 用于回显：只将叶子节点设入 checkedKeys，父节点会被 Tree 自动计算为半选状态
     * 解决问题：后台返回父+子节点 ID，直接设入 checkedKeys 会导致父子联动模式下父节点下所有子节点被全选
     */
    const getLeafKeys = (
      keys: React.Key[],
      treeData: TreeDataNode[]
    ): React.Key[] => {
      const keySet = new Set(keys.map(String));
      const parentKeys = new Set<string>();

      // 遍历树，找出在 keySet 中且有子节点（子节点也在 keySet 中）的 key，标记为父节点
      const traverse = (nodes: TreeDataNode[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            // 如果该节点在 keySet 中，且其任一子节点也在 keySet 中，则该节点是"父节点"角色
            const hasChildInSet = node.children.some((child) =>
              keySet.has(String(child.key))
            );
            if (keySet.has(String(node.key)) && hasChildInSet) {
              parentKeys.add(String(node.key));
            }
            traverse(node.children);
          }
        });
      };
      traverse(treeData);

      // 返回不在 parentKeys 中的 key（即叶子节点或无子节点在集合中的节点）
      return keys.filter((key) => !parentKeys.has(String(key)));
    };

    const result = !hasStrictlySelectedParent(tree);
    setMenuCheckStrictly(result);
    if (result) {
      // 联动模式 (checkStrictly=false)：只设叶子节点
      // 父节点会被 Tree 组件根据子节点勾选状态自动计算为半选(indeterminate)
      const leafKeys = getLeafKeys(allKeys, tree);
      const leafKeySet = new Set(leafKeys.map(String));
      const parentKeys = allKeys.filter((key) => !leafKeySet.has(String(key)));
      setCheckedKeys(leafKeys);
      setHalfCheckedKeys(parentKeys);
    } else {
      // 非联动模式 (checkStrictly=true)：Tree 不会自动推算父子关系
      // 需要将所有 key 直接设入 checkedKeys
      setCheckedKeys(allKeys);
      setHalfCheckedKeys([]);
    }
    return result;
  };

  // 模拟获取数据
  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData([...MOCK_ROLES]);
      setPagination((prev) => ({ ...prev, total: MOCK_ROLES.length }));
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 搜索
  const handleSearch = () => {
    fetchData();
    message.success("查询成功");
  };

  // 重置
  const handleReset = () => {
    searchForm.resetFields();
    fetchData();
  };

  // 表格多选
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 模态框操作
  const openModal = (type: "add" | "edit", record?: RoleRecord) => {
    setModalType(type);
    setCurrentRecord(record || null);
    setModalVisible(true);

    // 重置树状态
    setMenuExpandAll(false);
    setMenuCheckAll(false);
    setMenuCheckStrictly(true);
    setExpandedKeys([]);
    // 保存角色权限，无论是否有勾选都保存（空数组表示无权限）
    // 合并全选节点 + 半选父节点，确保菜单层级完整传入后台
    const validMenuIds = [...checkedKeys, ...halfCheckedKeys]
      .filter((key) => key !== null && key !== undefined && key !== "")
      .map((key) => Number(key))
      .filter((id) => !isNaN(id));
    if (validMenuIds.length === 0) {
      message.warning("请至少选择一个菜单权限");
      return;
    }

    if (type === "add") {
      setCheckedKeys([]);
      // 默认值
      setTimeout(() => {
        modalForm.resetFields();
        modalForm.setFieldsValue({
          roleSort: 0,
          status: "0",
        });
      }, 0);
    } else if (record) {
      // 编辑模式-分配父子节点至各自数组存储回显
      // 将后台返回的菜单 ID 转换为字符串
      const allKeys: React.Key[] = record.menuIds || [];
      // 推断当前数据的父子联动模式
      inferMenuCheckStrictly(allKeys, MOCK_MENU_TREE);
      setTimeout(() => {
        modalForm.setFieldsValue({
          ...record,
        });
      }, 0);
    }

    setModalVisible(false);
    // getList(); // 刷新
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      // 模拟提交
      const newRole = {
        ...currentRecord,
        ...values,
        id:
          modalType === "add"
            ? String(MOCK_ROLES.length + 1)
            : currentRecord?.id,
        menuIds: checkedKeys,
        createTime:
          modalType === "add"
            ? dayjs().format("YYYY-MM-DD HH:mm:ss")
            : currentRecord?.createTime,
      };

      console.log("Submit Role:", newRole);

      message.success(modalType === "add" ? "新增成功" : "修改成功");
      setModalVisible(false);
      fetchData(); // 刷新
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  // 删除
  const handleDelete = (ids: Key[]) => {
    Modal.confirm({
      title: "系统提示",
      content: `是否确认删除角色编号为"${ids.join(",")}"的数据项？`,
      onOk: () => {
        message.success("删除成功");
        fetchData();
        setSelectedRowKeys([]);
      },
    });
  };

  // 树操作
  const handleExpandAll = (checked: boolean) => {
    setMenuExpandAll(checked);
    setExpandedKeys(checked ? allMenuKeys : []);
  };

  const handleCheckAll = (checked: boolean) => {
    setMenuCheckAll(checked);
    setCheckedKeys(checked ? allMenuKeys : []);
  };

  const handleCheckStrictly = (checked: boolean) => {
    setMenuCheckStrictly(checked);
  };

  const onCheck = (checkedKeysValue: any, info: any) => {
    console.log("勾选的key", checkedKeysValue, "info", info);
    // checkStrictly={false}（父子联动）时，checkedKeysValue 是 Key[]
    //   info.halfCheckedKeys 包含半选（indeterminate）的父节点 key
    // checkStrictly={true}（非父子联动）时，checkedKeysValue 是 { checked: Key[], halfChecked: Key[] }
    if (Array.isArray(checkedKeysValue)) {
      // 父子联动模式：checkedKeys 仅存全选节点用于 Tree 展示
      // halfCheckedKeys 单独存储，提交后台时再合并
      setCheckedKeys(checkedKeysValue);
      setHalfCheckedKeys(info?.halfCheckedKeys || []);
    } else {
      // 非父子联动模式：直接使用 checked 数组
      setCheckedKeys(checkedKeysValue.checked);
      setHalfCheckedKeys([]);
    }
  };

  // 列定义
  const columns: TableProps<RoleRecord>["columns"] = [
    {
      title: "角色编号",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
      align: "left",
    },
    {
      title: "权限字符",
      dataIndex: "roleKey",
      key: "roleKey",
      align: "left",
    },
    {
      title: "显示顺序",
      dataIndex: "roleSort",
      key: "roleSort",
      align: "center",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status) => (
        <Switch
          checked={status === "0"}
          checkedChildren="正常"
          unCheckedChildren="停用"
        />
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
      width: 200,
      // fixed: 'right',
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
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete([record.id])}
          >
            删除
          </Button>
          <Button type="link" size="small" style={{ color: "#faad14" }}>
            更多
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* 搜索区域 */}
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="roleName" label="角色名称">
              <Input placeholder="请输入角色名称" allowClear />
            </Form.Item>
            <Form.Item name="roleKey" label="权限字符">
              <Input placeholder="请输入权限字符" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="角色状态" allowClear style={{ width: 120 }}>
                <Select.Option value="0">正常</Select.Option>
                <Select.Option value="1">停用</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="createTime" label="创建时间">
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

        {/* 表格区域 */}
        <Card
          variant="borderless"
          className="shadow-sm rounded-lg"
          styles={{ body: { padding: "16px" } }}
        >
          {/* 工具栏 */}
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
                style={{
                  backgroundColor: token.colorSuccess,
                  borderColor: token.colorSuccess,
                }}
                icon={<EditOutlined />}
                disabled={selectedRowKeys.length !== 1}
                onClick={() => {
                  const record = data.find(
                    (item) => item.id === selectedRowKeys[0]
                  );
                  if (record) openModal("edit", record);
                }}
              >
                修改
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={() => handleDelete(selectedRowKeys)}
              >
                删除
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: token.colorWarning,
                  borderColor: token.colorWarning,
                }}
                icon={<DownloadOutlined />}
              >
                导出
              </Button>
            </Space>
            <Space style={{ float: "right" }}></Space>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={(p) => setPagination(p)}
            scroll={{ x: 1000 }}
          />
        </Card>
      </Space>

      {/* 新增/修改模态框 */}
      <Modal
        title={modalType === "add" ? "添加角色" : "修改角色"}
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
          wrapperCol={{ span: 19 }}
          initialValues={{ status: "0", roleSort: 0 }}
        >
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                权限字符&nbsp;
                <Tooltip title="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)">
                  <QuestionCircleOutlined
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  />
                </Tooltip>
              </span>
            }
            name="roleKey"
            rules={[{ required: true, message: "请输入权限字符" }]}
          >
            <Input placeholder="请输入权限字符" />
          </Form.Item>

          <Form.Item
            label="角色顺序"
            name="roleSort"
            rules={[{ required: true, message: "请输入角色顺序" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="菜单权限">
            <Space style={{ marginBottom: 8 }}>
              <Checkbox
                onChange={(e) => handleExpandAll(e.target.checked)}
                checked={menuExpandAll}
              >
                展开/折叠
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckAll(e.target.checked)}
                checked={menuCheckAll}
              >
                全选/全不选
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckStrictly(e.target.checked)}
                checked={!menuCheckStrictly}
              >
                父子联动
              </Checkbox>
            </Space>
            <div
              style={{
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 4,
                padding: "8px 8px",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <Tree
                checkable
                checkStrictly={menuCheckStrictly}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                treeData={MOCK_MENU_TREE}
              />
            </div>
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Radio.Group defaultValue={"0"}>
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
