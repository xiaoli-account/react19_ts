/** @format */

import "./styles.scss";
import { Button, Dropdown, Form, Input } from "antd";
import {
  GlobalOutlined,
  MoonFilled,
  SunOutlined,
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ReactLogo from "../../assets/react.svg";
import { useLogin } from "./use-login";
import type { RegisterInfo } from "@/store/user";

const Register = () => {
  const {
    t,
    form,
    registerTitle,
    registerSubtitle,
    theme,
    locale,
    loading,
    passwordVisible,
    setPasswordVisible,
    languageMenuItems,
    handleRegister,
    goDarkLogin,
    handleLanguageMenuClick,
    goBackLogin,
  } = useLogin();
  // 设置注册表单初始值
  const initialRegisterForm: RegisterInfo = {
    loginName: "",
    password: "",
    email: "",
  };

  return (
    <div className="login-main">
      <div className="login-header">
        <div className="login-header-title">
          <img className="login-logo" src={ReactLogo} alt="Logo" />
          <h1 className="login-title">{registerTitle}</h1>
        </div>
        <h2 className="login-subtitle">{registerSubtitle}</h2>
      </div>
      <div className="theme-switch">
        <Button
          type="text"
          icon={theme === "light" ? <MoonFilled /> : <SunOutlined />}
          onClick={goDarkLogin}
        />
      </div>
      <div className="language-switch">
        <Dropdown
          menu={{
            items: languageMenuItems,
            onClick: handleLanguageMenuClick,
          }}
          placement="bottomRight"
        >
          <Button type="text" icon={<GlobalOutlined />}>
            {locale === "zh-CN" ? "中" : "En"}
          </Button>
        </Dropdown>
      </div>

      <div className="login-content" style={{ height: "530px" }}>
        <Form
          form={form}
          name="register"
          initialValues={initialRegisterForm}
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
        >
          <div className="register-form">
            <Form.Item
              name="loginName"
              label="用户名"
              rules={[
                { required: true, message: t("login.placeholderUsername") },
                { min: 3, message: t("login.usernameMinLength") },
                { max: 20, message: t("login.usernameMaxLength") },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t("login.placeholderUsername")}
                allowClear
                autoComplete="new-username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: t("login.placeholderEmail") },
                { type: "email", message: t("login.invalidEmail") },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t("login.placeholderEmail")}
                allowClear
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: t("login.placeholderPassword") },
                { min: 6, message: t("login.passwordMinLength") },
              ]}
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

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: t("login.placeholderConfirmPassword"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("login.passwordMismatch"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("login.placeholderConfirmPassword")}
                allowClear
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button"
              >
                {loading ? t("login.registing") : t("login.register")}
              </Button>
            </Form.Item>
          </div>
        </Form>

        <div className="register-link">
          <span>{t("login.yesAccount")}</span>
          <Button type="link" onClick={goBackLogin}>
            {t("login.login")}
          </Button>
        </div>
      </div>
      <div className="login-footer">
        <p>{t("webSite.copyright")}</p>
      </div>
    </div>
  );
};

export default Register;
