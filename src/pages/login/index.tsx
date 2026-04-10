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
import { useState } from "react";
import pkg from "../../../package.json";
import LeeAccess from "@/layout/components/Lee-Access";

const Login = () => {
  const {
    form,
    loginTitle,
    loginSubtitle,
    theme,
    locale,
    languageMenuItems,
    loginTabs,
    initialValues,
    handleLogin,
    goDarkLogin,
    handleSocialLogin,
    goRegister,
    handleLanguageMenuClick,
    handleTabChange,
    t,
  } = useLogin();
  const [version, setVersion] = useState<string>(pkg.version);

  return (
    <div className="login-main">
      <div className="login-header">
        <div className="login-header-title">
          <img className="login-logo" src={ReactLogo} alt="Logo" />
          <h1 className="login-title">{loginTitle}</h1>
        </div>
        <h2 className="login-subtitle">{loginSubtitle}</h2>
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
        <LeeAccess permissionCode="btn:register:registerUser">
          <div className="register-link">
            <span>{t("login.noAccount")}</span>
            <Button type="link" onClick={goRegister}>
              {t("login.register")}
            </Button>
          </div>
        </LeeAccess>
      </div>
      <div className="login-footer">
        <p>
          {t("webSite.copyright")} v{version}
        </p>
      </div>
    </div>
  );
};

export default Login;
