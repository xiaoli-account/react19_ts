/** @format */

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";

const { Option } = Select;
const { TextArea } = Input;

const FormExample = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("表单提交值:", values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">表单示例</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入有效的邮箱地址!" },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="年龄"
          name="age"
          rules={[{ required: true, message: "请输入年龄!" }]}
        >
          <InputNumber
            min={1}
            max={120}
            placeholder="请输入年龄"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: "请选择性别!" }]}
        >
          <Select placeholder="请选择性别">
            <Option value="male">男</Option>
            <Option value="female">女</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="出生日期"
          name="birthDate"
          rules={[{ required: true, message: "请选择出生日期!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="个人简介" name="description">
          <TextArea rows={4} placeholder="请输入个人简介" />
        </Form.Item>

        <Form.Item label="是否激活" name="active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
            提交
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormExample;
