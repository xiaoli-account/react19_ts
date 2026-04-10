/** @format */

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Space,
  type TabsProps,
} from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import LeeButton from "@/layout/components/Lee-Button";
import { LoginService } from "@/services";

export const useLoginForm = (message: any, form: any) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { isRemeber, getLoginInfo } = useUserStore();
  const loginService = new LoginService();

  // 设置表单初始值
  const initialValues = {
    account: "",
    password: "",
    verificationCode: "",
    phone: "",
    phoneCode: "",
    emailDomain: "@qq.com",
    remember: false,
    mode: activeTab,
  };
  // 图形验证码
  const [verificationCodeImg, setVerificationCodeImg] = useState(
    "data:image/png;base64,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"
  );

  /**
   * 处理忘记密码
   */
  const handleForgotPassword = () => {
    message.info("无法自主找回密码，请提供账号信息，联系管理员重置密码！");
  };

  /**
   * 处理tab切换
   * @param key tab键值
   */
  const handleTabChange = (key: string) => {
    // 切换tab
    setActiveTab(key);
    // 表单数据重置
    form.resetFields();
    // 设置登录模式（重置后再设置，避免被清除）
    form.setFieldsValue({ mode: key });
    // 登录loading重置
    setLoading(false);
  };

  /**
   * 获取图形验证码
   */
  const getVerificationCode = () => {
    console.log("获取图形验证码");
    loginService.getVerificationCode().then((res) => {
      setVerificationCodeImg(res.data.img_base);
    });
  };

  /**
   * 获取登录验证码
   */
  const getLoginCode = () => {
    message.info("获取登录验证码功能，正在开发中...");
  };

  // 组件挂载后的初始化逻辑（类似 Vue 的 mounted）
  useEffect(() => {
    // 如果有记住的登录信息，填充表单
    const loginInfo = getLoginInfo();
    if (isRemeber && loginInfo) {
      form.setFieldsValue(loginInfo);
    }
  }, [isRemeber, form, getLoginInfo]);

  useEffect(() => {
    // getVerificationCode();
  }, []);

  /**
   * 账号登录表单
   * @returns 账号登录表单
   */
  const accountNode = () => {
    return (
      <div className="login-form">
        <Form.Item name="mode" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="account"
          rules={[{ required: true, message: t("login.placeholderUsername") }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t("login.placeholderUsername")}
            allowClear
            autoComplete="account"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: t("login.placeholderPassword") }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("login.placeholderPassword")}
            allowClear
            autoComplete="new-password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item className="login-verificationCode">
          <Form.Item
            name="verificationCode"
            noStyle
            rules={[
              {
                required: true,
                message: t("login.placeholderVerificationCode"),
              },
            ]}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder={t("login.placeholderVerificationCode")}
              allowClear
              autoComplete="new-verificationCode"
            />
          </Form.Item>
          <img
            src={verificationCodeImg}
            alt="验证码"
            className="verification-code-img"
            onClick={getVerificationCode}
            style={{ cursor: "pointer" }}
          />
        </Form.Item>

        <Form.Item className="login-options">
          <Form.Item
            className="remember-btn"
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>{t("login.remember")}</Checkbox>
          </Form.Item>
          <Button
            type="link"
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            {t("login.forgotPassword")}
          </Button>
        </Form.Item>

        <Form.Item>
          <LeeButton
            permissionCode="btn:login:login"
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="login-button"
          >
            {loading ? t("login.logining") : t("login.login")}
          </LeeButton>
        </Form.Item>
      </div>
    );
  };

  /**
   * 手机号登录表单
   * @returns 手机号登录表单
   */
  const phoneNode = () => {
    return (
      <div className="login-form">
        <Form.Item
          name="phone"
          rules={[{ required: true, message: t("login.placeholderPhone") }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t("login.placeholderPhone")}
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="phoneCode"
              noStyle
              rules={[{ required: true, message: t("login.placeholderCode") }]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder={t("login.placeholderCode")}
                autoComplete="one-time-code"
              />
            </Form.Item>
            <Button
              type="primary"
              className="getLoginCode"
              onClick={getLoginCode}
            >
              {t("login.getCode")}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="login-button"
          >
            {loading ? t("login.logining") : t("login.login")}
          </Button>
        </Form.Item>
      </div>
    );
  };

  /**
   * 邮箱登录表单
   * @returns 邮箱登录表单
   */
  const emailNode = () => {
    return (
      <div className="login-form">
        <Space vertical size="middle" className="login-space">
          <Space.Compact>
            <Form.Item
              name="email"
              noStyle
              rules={[{ required: true, message: t("login.placeholderEmail") }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t("login.placeholderEmail")}
                autoComplete="new-email"
              />
            </Form.Item>
            <Form.Item
              name="emailDomain"
              noStyle
              rules={[{ required: true, message: "Email domain is required" }]}
            >
              <Select
                className="login-select"
                options={[
                  {
                    value: "@qq.com",
                    label: "@qq.com",
                  },
                  {
                    value: "@163.com",
                    label: "@163.com",
                  },
                ]}
              />
            </Form.Item>
          </Space.Compact>
        </Space>

        <Form.Item
          name="password"
          rules={[{ required: true, message: t("login.placeholderPassword") }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("login.placeholderPassword")}
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item className="login-verificationCode">
          <Form.Item
            name="verificationCode"
            noStyle
            rules={[
              {
                required: false,
                message: t("login.placeholderVerificationCode"),
              },
            ]}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder={t("login.placeholderVerificationCode")}
              allowClear
              autoComplete="new-verificationCode"
            />
          </Form.Item>
          <img
            src={verificationCodeImg}
            alt="验证码"
            className="verification-code-img"
            onClick={getVerificationCode}
            style={{ cursor: "pointer" }}
          />
        </Form.Item>

        <Form.Item className="login-options">
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>{t("login.remember")}</Checkbox>
          </Form.Item>
          <Button
            type="link"
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            {t("login.forgotPassword")}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="login-button"
          >
            {loading ? t("login.logining") : t("login.login")}
          </Button>
        </Form.Item>
      </div>
    );
  };

  /**
   * 登录tab配置
   * @returns 登录tab配置
   */
  const loginTabs: TabsProps["items"] = [
    {
      key: "account",
      label: t("login.loginTabAccount"),
      disabled: loading,
      children: accountNode(),
    },
    {
      key: "email",
      label: t("login.loginTabEmail"),
      disabled: loading,
      children: emailNode(),
    },
    {
      key: "phone",
      label: t("login.loginTabPhone"),
      disabled: loading,
      children: phoneNode(),
    },
  ];

  return {
    loginTabs,
    loading,
    setLoading,
    handleTabChange,
    initialValues,
    passwordVisible,
    setPasswordVisible,
  };
};
