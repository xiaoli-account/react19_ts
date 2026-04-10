/** @format */

import "./styles.scss";
import { Button, Tabs, Space, Divider, Dropdown, Form } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  GoogleOutlined,
  GlobalOutlined,
  MoonFilled,
  SunOutlined,
} from "@ant-design/icons";
import ReactLogo from "../../assets/react.svg";
import { useLogin } from "./use-login";

import pkg from "../../../package.json";
import { useState } from "react";

const Login = () => {
  const {
    form,
    loginTitle,
    loginSubtitle,
    menuOpen,
    theme,
    locale,
    languageMenuItems,
    loginTabs,
    initialValues,
    handleLogin,
    goLightLogin,
    handleSocialLogin,
    handleRegister,
    goRegister,
    handleLanguageMenuClick,
    handleTabChange,
    t,
  } = useLogin();
  const [version, setVersion] = useState<string>(pkg.version);

  return (
    <div className="login-dark-main">
      <iframe
        src={`webview/login-bg/index.html`}
        // src={`${window.location.href}/webview/login-bg/index.html`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 1,
        }}
      />

      {!menuOpen && (
        <div className="login-header">
          <div className="login-header-title">
            <img className="login-logo" src={ReactLogo} alt="Logo" />
            <h1 className="login-title">{loginTitle}</h1>
          </div>
          <h2 className="login-subtitle">{loginSubtitle}</h2>
        </div>
      )}

      {!menuOpen && (
        <div className="theme-switch">
          <Button
            type="text"
            icon={theme === "light" ? <MoonFilled /> : <SunOutlined />}
            onClick={goLightLogin}
          />
        </div>
      )}
      {!menuOpen && (
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
      )}

      {!menuOpen && (
        <div className="login-content">
          <Form
            form={form}
            name="login"
            initialValues={initialValues}
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Tabs
              items={loginTabs}
              onChange={handleTabChange}
              centered
              destroyOnHidden
              className="login-tabs"
            />
          </Form>

          <Divider className="login-divider">
            {t("login.otherLoginMethods")}
          </Divider>

          <div className="social-login">
            <Space size="large">
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialLogin("Facebook")}
                className="social-button"
              />
              <Button
                icon={<TwitterOutlined />}
                onClick={() => handleSocialLogin("Twitter")}
                className="social-button"
              />
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("Google")}
                className="social-button"
              />
            </Space>
          </div>

          <div className="register-link">
            <span>{t("login.noAccount")}</span>
            <Button type="link" onClick={goRegister}>
              {t("login.register")}
            </Button>
          </div>
        </div>
      )}

      {!menuOpen && (
        <div className="login-footer">
          <p>
            {t("webSite.copyright")} v{version}
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
