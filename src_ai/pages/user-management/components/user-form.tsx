/** @format */

import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { User, UserFormData } from "../types";
import {
  ROLE_OPTIONS as roleOptions,
  STATUS_OPTIONS as statusOptions,
} from "../types";

interface UserFormProps {
  open: boolean;
  editingUser: User | null;
  onCancel: () => void;
  onSubmit: (values: UserFormData) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  editingUser,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<UserFormData>();
  const isEdit = !!editingUser;

  useEffect(() => {
    if (open) {
      if (editingUser) {
        // 编辑模式：填充表单数据
        form.setFieldsValue({
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          status: editingUser.status,
        });
      } else {
        // 新建模式：重置表单
        form.resetFields();
      }
    }
  }, [open, editingUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑用户" : "新建用户"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: "请输入用户名" },
            { min: 3, max: 20, message: "用户名长度为 3-20 个字符" },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: "用户名只能包含字母、数字和下划线",
            },
          ]}
        >
          <Input placeholder="请输入用户名" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入有效的邮箱地址" },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: "请输入手机号" },
            { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, max: 20, message: "密码长度为 6-20 个字符" },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select placeholder="请选择角色" options={roleOptions} />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: "请选择状态" }]}
        >
          <Select placeholder="请选择状态" options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
