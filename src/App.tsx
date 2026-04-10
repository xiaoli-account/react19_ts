/** @format */

import { ConfigProvider, App as AntdApp } from "antd";
import AppRouter from "./router";
import { useAntdConfig } from "./layout/hooks";
import "antd/dist/reset.css";
import "./layout/i18n";
import { BrowserRouter } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { AntdGlobal } from "./utils/globalAntd";
import leeVersion, { LeeVersionComponent } from "./layout/utils/leeVersion";

function App() {
  // 使用 Ant Design 配置 Hook ，统一管理组件库的主题和国际化
  const { antdLocale, antdConfig } = useAntdConfig();

  // 应用启动时执行版本检查
  useEffect(() => {
    // 设置版本变化回调
    leeVersion.onVersionChange((oldVersion, newVersion) => {
      // console.log(`[LeeVersion] 应用已更新: ${oldVersion} → ${newVersion}`);
      // 这里可以添加提示用户刷新页面的逻辑
      window.location.reload();
    });

    // 运行版本检查
    leeVersion.runVersionCheck();
  }, []);

  return (
    <StrictMode>
      <ConfigProvider locale={antdLocale} theme={antdConfig}>
        <AntdApp style={{ height: "100%" }}>
          <AntdGlobal />
          <BrowserRouter>
            <LeeVersionComponent />
            <AppRouter />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </StrictMode>
  );
}

export default App;
