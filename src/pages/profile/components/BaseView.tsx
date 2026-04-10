/** @format */

import { useState } from "react";
import { Form, Input, Button, Upload, App, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useUserStore } from "@/store/user";
import "../styles.scss";
const { TextArea } = Input;

const BaseView = () => {
  const { message } = App.useApp();
  const { userInfo, updateUserInfo } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    userInfo?.avatar
  );

  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    setLoading(true);
    console.log("Updated Profile:", values);
    // 更新store用户信息
    updateUserInfo("nickname", values.nickname);
    updateUserInfo("description", values.description);
    setTimeout(() => {
      setLoading(false);
      message.success("基本信息更新成功");
    }, 1000);
  };

  const uploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只能上传 JPG/PNG 文件!");
      }
      // 2MB limit
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过 2MB!");
      }
      if (isJpgOrPng && isLt2M) {
        // Mock upload - just display the file
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarUrl(e.target?.result as string);
          // 更新store用户信息
          updateUserInfo("avatar", e.target?.result as string);
        };
        reader.readAsDataURL(file);
        message.success("头像上传成功");
      }
      return false; // Prevent auto upload
    },
  };

  return (
    <>
      <div className="profile-header">
        <h2>基本设置</h2>
      </div>
      <div className="profile-content">
        {/* Left Form Section */}
        <div className="profile-left">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              nickname: userInfo?.nickname || "",
              description: userInfo?.description || "",
            }}
          >
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: "请输入昵称!" }]}
            >
              <Input placeholder="请输入您的昵称" allowClear />
            </Form.Item>

            <Form.Item label="个人简介" name="description">
              <TextArea
                rows={4}
                placeholder="个人简介"
                style={{ resize: "vertical" }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存基本信息
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Right Avatar Section */}
        <div className="profile-right">
          <div className="avatar-title">头像</div>
          <div className="avatar-wrapper">
            <Avatar
              size={144}
              src={avatarUrl}
              icon={<UserOutlined style={{ fontSize: 64 }} />}
            />
          </div>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </div>
      </div>
    </>
  );
};

export default BaseView;
