/** @format */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore, type LoginInfo, type RegisterInfo } from "@/store/user";
import { useI18n } from "@/layout/hooks/use-i18n";
import { App, Form } from "antd";
import { createMenuConfig } from "@/layout/constants/menuConfig";
import { useLoginForm } from "./login-form";
import { useTheme } from "@/layout/hooks/use-theme";
import { LeeLogger } from "@/layout/utils/leeLogger";
import { LoginService } from "@/services/login-service";

export const useLogin = () => {
  const loginService = new LoginService();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLogin, isRemeber, loginInfo } = useUserStore();
  const { languageMenuItems } = createMenuConfig(t);
  const { locale, setLanguage, getI18nByKey } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const {
    loginTabs,
    loading,
    setLoading,
    handleTabChange,
    initialValues,
    passwordVisible,
    setPasswordVisible,
  } = useLoginForm(message, form);

  const [loginTitle, setLoginTitle] = useState(getI18nByKey("webSite.name"));
  const [loginSubtitle, setLoginSubtitle] = useState(
    getI18nByKey("webSite.description")
  );
  const [registerTitle, setRegisterTitle] = useState(
    getI18nByKey("login.registerTitle")
  );
  const [registerSubtitle, setRegisterSubtitle] = useState(
    getI18nByKey("login.registerSubtitle")
  );

  const [menuOpen, setMenuOpen] = useState(false);

  // 监听语言变化，更新标题和副标题
  useEffect(() => {
    setLoginTitle(getI18nByKey("webSite.name"));
    setLoginSubtitle(getI18nByKey("webSite.description"));
    setRegisterTitle(getI18nByKey("login.registerTitle"));
    setRegisterSubtitle(getI18nByKey("login.registerSubtitle"));
  }, [locale, getI18nByKey]);

  // 组件挂载后的初始化逻辑（类似 Vue 的 mounted）
  useEffect(() => {
    // 如果已经登录，直接跳转到首页
    if (isLogin) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isLogin, isRemeber, loginInfo, form, navigate]);

  // 接受烟花背景的iframe消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "pause-toggle") {
        console.log("收到暂停消息", event.data);
        // 可以在这里处理暂停状态，比如显示/隐藏暂停指示器
        if (event.data.paused) {
          message.info("烟花动画已暂停");
        } else {
          message.info("烟花动画已开启");
        }
      }

      if (event.data.type === "sound-toggle") {
        console.log("收到声音消息", event.data);
        // 可以在这里处理声音状态，比如更新UI状态
        if (event.data.soundEnabled) {
          message.info("烟花音效已开启");
        } else {
          message.info("烟花音效已关闭");
        }
      }

      if (event.data.type === "menu-toggle") {
        console.log("收到菜单消息", event.data);
        // 可以在这里处理菜单状态，比如同步外部菜单显示
        if (event.data.menuOpen) {
          // 菜单打开时的处理
          document.body.style.overflow = "hidden"; // 防止背景滚动
          setMenuOpen(true);
        } else {
          // 菜单关闭时的处理
          document.body.style.overflow = ""; // 恢复滚动
          setMenuOpen(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [message]);

  // 处理登录
  const handleLogin = (values: LoginInfo) => {
    LeeLogger.info("用户点击登录按钮", values);
    setLoading(true);
    // 执行登录
    login(values)
      .then((res) => {
        if (res) {
          // 页面跳转
          message.success(t("login.loginSuccess"));
          const from = (location.state as any)?.from?.pathname || "/loading";
          navigate(from, { replace: true });
        }
      })
      .catch((error) => {
        console.log("查看错误信息", error);
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 处理注册
   */
  const handleRegister = async (values: RegisterInfo) => {
    LeeLogger.info("用户点击注册按钮", values);
    setLoading(true);
    try {
      // 执行注册
      const res = await loginService.registerUser(values);
      console.log("查看注册结果", res);
      if (res.data === true) {
        // 页面跳转
        message.success(t("login.registerSuccess"));
        goBackLogin();
      } else {
        message.error(t("login.registerFailed"));
      }
    } catch (error) {
      message.error(t("login.registerFailed"));
    } finally {
      setLoading(false);
    }
  };


  /**
   * 返回至登录页
   */
  const goBackLogin = () => {
    navigate("/login", { replace: true });
  };
  /**
   * 切换到暗黑模式登录页
   */
  const goDarkLogin = () => {
    if (theme === "light") {
      navigate("/login-dark", { replace: true });
    }
    setTimeout(() => {
      toggleTheme();
    }, 200);
  };

  /**
   * 切换到亮色模式登录页
   */
  const goLightLogin = () => {
    if (theme === "dark") {
      toggleTheme();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 200);
    }
  };
  /**
   * 前往注册页面
   */
  const goRegister = () => {
    navigate("/register", { replace: false });
  };

  /**
   * 处理社交登录
   * @param platform 社交平台
   */
  const handleSocialLogin = (platform: string) => {
    message.info(`${platform} 登录，正在开发中...`);
  };

  /**
   * 处理语言菜单点击
   */
  const handleLanguageMenuClick = (menuInfo: any) => {
    setLanguage(menuInfo.key as "zh-CN" | "en-US");
  };

  return {
    // 状态
    form,
    loginTitle,
    loginSubtitle,
    registerTitle,
    registerSubtitle,
    menuOpen,
    theme,
    locale,
    languageMenuItems,
    loginTabs,
    initialValues,
    loading,
    setLoading,
    passwordVisible,
    setPasswordVisible,
    // 方法
    handleLogin,
    goDarkLogin,
    goLightLogin,
    handleSocialLogin,
    handleRegister,
    goRegister,
    handleLanguageMenuClick,
    handleTabChange,
    t,
    message,
    goBackLogin,
  };
};
