/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Tabs, theme, Layout, type MenuProps } from "antd";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { type TagView, useTabsStore } from "@/layout/stores/tabs-store";
import allRoutes from "@/router/routes";
import type { RouteItem } from "@/layout/router/router-type";
import {
  SyncOutlined,
  CloseOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "./styles.scss";

const { Content } = Layout;

interface TabProps {
  children?: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  // 页签忽略路由
  const routeIgnoreList = ["/", "/login", "/register", "/404", "/403", "/500"];

  const { visitedViews, addView, delView } = useTabsStore();

  /*
   * =============================================
   * Principle (实现原理): DOM 隐藏 vs 销毁
   * =============================================
   * 本组件实现了一种 "显隐式" 的 KeepAlive 策略。
   *
   * 1. 缓存容器 (componentsRef):
   *    使用 useRef 维护一个 Map，Key 为路由路径，Value 为对应的 React 节点 (Outlet)。
   *    React 的 Outlet 本质上是当前路由匹配到的组件实例的描述。
   *
   * 2. 状态保持机制:
   *    - 当用户访问一个 KeepAlive 页面时，我们将当前的 outlet 存入 Map。
   *    - 当用户切走到其他 Tab 时，我们依然在 map 循环中渲染这个旧的 outlet (从 Map 中取出)。
   *    - 因为这个 React Element 依然存在于组件树中，React 不会执行卸载 (Unmount)，
   *      所以组件内部的 State (useState, useReducer) 得以保留。
   *    - Ant Design 的 Tabs 组件在切换 Tab 时，只是通过 CSS (display: none) 隐藏了非激活的 Pane，
   *      并没有将 DOM 节点从文档流中移除（除非专门配置），这进一步确保了 DOM 状态（如滚动位置）的相对稳定。
   */
  const componentsRef = useRef<Map<string, React.ReactNode>>(new Map());
  const [activeKey, setActiveKey] = useState(location.pathname);

  // 路由扁平化 Map：用于 O(1) 复杂度根据 path 查找路由元数据 (meta)
  // 因为这是在 Tab 组件内部，我们需要快速知道当前 URL 对应的 title 和 keepAlive 配置
  const routeMap = useRef<Map<string, RouteItem>>(new Map());

  // 初始化 Effect: 将所有嵌套路由展平放入 routeMap
  // 目的: 当 location 变化时，能够根据 pathname 快速查找到对应的路由配置信息
  useEffect(() => {
    const flatten = (routes: RouteItem[], parentPath = "") => {
      routes.forEach((route) => {
        let fullPath = route.path;
        if (!fullPath.startsWith("/") && parentPath) {
          fullPath = `${parentPath}/${fullPath}`;
        }
        fullPath = fullPath.replace(/\/\//g, "/");

        routeMap.current.set(fullPath, route);
        if (route.children) {
          flatten(route.children, fullPath);
        }
      });
    };
    flatten(allRoutes);
  }, []);

  // 核心 Effect: 监听路由变化，管理标签页与缓存
  useEffect(() => {
    // 如果是忽略路由，则不添加
    if (routeIgnoreList.includes(location.pathname)) {
      return;
    }
    const matchedRoute = routeMap.current.get(location.pathname);

    if (matchedRoute && matchedRoute.meta) {
      const { title, i18n, keepAlive } = matchedRoute.meta;
      // 构造当前页面的 Tag 数据模型
      const view: TagView = {
        path: location.pathname,
        name: matchedRoute.name || "",
        title: title || "Unknown",
        locale: i18n,
        keepAlive,
      };

      // 1. 将当前页面加入到 visitedViews store 中 (用于渲染顶部 Tab 标签)
      addView(view);

      // 2. 处理缓存逻辑
      // 如果当前路由配置了 keepAlive: true，我们需要保存当前的组件实例 (outlet)
      // 这样当用户切走再切回来时，我们可以从 componentsRef 中恢复它
      if (keepAlive && outlet) {
        componentsRef.current.set(location.pathname, outlet);
      }
    }

    // 同步所有的 Tab 高亮状态
    setActiveKey(location.pathname);
  }, [location, addView, outlet]);

  // Effect: 监听 visitedViews 变化，清理组件缓存
  // 当 store 自动清理超过限制的 Tab 时（例如限制 10 个），我们需要同步清理 componentsRef 中的缓存
  // 否则 componentsRef 会无限增长，引发内存泄漏
  useEffect(() => {
    const currentPaths = new Set(visitedViews.map((v) => v.path));
    componentsRef.current.forEach((_, key) => {
      if (!currentPaths.has(key)) {
        componentsRef.current.delete(key);
      }
    });
  }, [visitedViews]);

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      const view = visitedViews.find((v) => v.path === targetKey);
      if (view) {
        handleClose(view);
      }
    }
  };

  // 处理 Tab 关闭事件
  const handleClose = (view: TagView) => {
    // 1. 从 store 中移除 view
    delView(view);
    // 2. 清除特定页面的组件缓存，释放内存
    // 注意：如果不手动 delete，Map 会一直增长导致内存泄漏
    componentsRef.current.delete(view.path);

    // 3. 智能跳转逻辑：如果关闭的是当前激活的 Tab，则需要自动跳转到其他页面
    if (view.path === activeKey) {
      const index = visitedViews.findIndex((v) => v.path === view.path);
      // 优先跳转到左侧标签，如果没有则跳转右侧，如果都没有则回首页
      const nextView = visitedViews[index - 1] || visitedViews[index + 1];
      if (nextView) {
        navigate(nextView.path);
      } else {
        navigate("/");
      }
    }
  };

  // 处理 Tab 点击跳转
  const handleTabClick = (key: string) => {
    navigate(key);
  };

  /**
   * 特殊处理根路径 "/"
   * 因为 "/" 被包含在 routeIgnoreList 中，所以不会生成 Tab。
   * 但我们需要渲染 outlet (其中包含 <Navigate to="/loading" />) 以便触发重定向。
   * 如果不渲染 outlet，重定向将不会发生。
   *
   * 注意：必须放在所有 Hooks 调用之后返回，否则违反 React Hooks 规则
   */
  if (location.pathname === "/") {
    return <>{outlet}</>;
  }

  return (
    <Tabs
      className="layout-tab"
      hideAdd
      type="editable-card"
      activeKey={activeKey}
      onChange={handleTabClick}
      onEdit={onEdit}
      size="small"
      items={visitedViews.map((view) => {
        const isKeepAlive = view.keepAlive;
        const isActive = view.path === activeKey;

        let content;
        // ==========================================
        // 渲染策略 (Render Strategy)
        // ==========================================

        // 情况 A: 当前激活的 Tab
        // 直接渲染当前的 outlet。这是 React Router 提供的最新路由组件。
        if (isActive) {
          content = outlet;
        }

        // 情况 B: 非激活，但配置了 KeepAlive 的 Tab
        // 从缓存 (componentsRef) 中取出之前保存的组件实例。
        // 只要这个 content 被渲染在 JSX 中，React 就不会卸载它，从而实现 "保活"。
        // Antd Tabs 会自动将其容器样式设为 hidden，用户不可见，但组件依然存活。
        else if (isKeepAlive) {
          content = componentsRef.current.get(view.path);
        }

        // 情况 C: 非激活，且不需要 KeepAlive
        // 渲染 null。React 会卸载该组件，状态丢失，释放内存。
        else {
          content = null;
        }

        // Extract props from children if available to mimic user structure
        let wrapperProps: any = {
          className: "content-wrapper"
        };

        if (React.isValidElement(children)) {
          // If user provided a wrapper, try to use its props.
          // Note: treating children as a template.
          const { className, style } = children.props as any;
          if (className) wrapperProps.className = className;
          // Merge style if needed, but we need height control for layout
          if (style) wrapperProps.style = { ...wrapperProps.style, ...style };
        }

        return {
          label: view.title,
          key: view.path,
          children: (
            <Content key={view.path} {...wrapperProps}>
              {content}
            </Content>
          ),
          closable: visitedViews.length > 1,
        };
      })}
    />
  );
};

export default Tab;
