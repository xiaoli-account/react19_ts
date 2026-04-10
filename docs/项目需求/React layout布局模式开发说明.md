# React Layout 布局模式开发说明

> **版本**: v1.0.0  
> **更新时间**: 2026-01-21  
> **适用范围**: React 19 企业级后台管理系统

---

## 📋 目录

- [一、概述](#一概述)
- [二、布局系统架构](#二布局系统架构)
- [三、布局模式详解](#三布局模式详解)
- [四、布局文件结构](#四布局文件结构)
- [五、布局状态管理](#五布局状态管理)
- [六、布局组件开发](#六布局组件开发)
- [七、使用方法](#七使用方法)
- [八、新增布局模式指南](#八新增布局模式指南)
- [九、最佳实践](#九最佳实践)

---

## 一、概述

### 1.1 设计目标

项目采用 **模块化布局系统**，支持：

| 特性 | 说明 |
|------|------|
| 多布局模式 | 支持 3 种布局模式 |
| 动态切换 | 运行时切换布局，无需刷新 |
| 状态持久化 | 布局偏好自动保存 |
| 独立封装 | 每种布局独立封装，互不影响 |
| 主题适配 | 各布局支持明暗主题 |
| 国际化支持 | 布局组件文案国际化 |

### 1.2 支持的布局模式

| 布局模式 | 标识 | 说明 |
|----------|------|------|
| 基础布局 | `lee-basic` | Header + Sidebar + Content |
| 侧边栏布局 | `lee-sidebar` | Sidebar(含Logo) + Content |
| 顶部菜单布局 | `lee-top-menu` | Header(含菜单) + Content |

### 1.3 技术方案

| 技术 | 用途 |
|------|------|
| React Router v7 | 路由嵌套和 Outlet |
| Ant Design v6 | UI 组件 (Layout, Menu, Breadcrumb) |
| Zustand | 布局状态管理 |
| SCSS + CSS Variables | 布局样式和主题 |

---

## 二、布局系统架构

### 2.1 架构图

```text
┌─────────────────────────────────────────────────────────────┐
│                    LayoutManager                            │
│  根据 layoutMode 渲染对应的布局组件                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  LeeBasicLayout  │ │ LeeSidebarLayout │ │ LeeTopMenuLayout │
│  基础布局         │ │  侧边栏布局       │ │  顶部菜单布局     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                   │                    │
         ▼                   ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                        Shared Components                     │
│  - Sidebar (菜单组件)                                        │
│  - Header (头部组件)                                         │
│  - Breadcrumb (面包屑组件)                                   │
│  - MenuCollapseBtn (折叠按钮)                                │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                        Shared Stores                         │
│  - layoutStore (布局状态)                                    │
│  - themeStore (主题状态)                                     │
│  - i18nStore (语言状态)                                      │
│  - menuStore (菜单状态)                                      │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 布局切换流程

```text
1. 用户点击布局切换按钮
       │
       ▼
2. 调用 layoutStore.setLayoutMode('lee-sidebar')
       │
       ▼
3. 更新 Zustand 状态
       │
       ▼
4. LayoutManager 重新渲染
       │
       ▼
5. 渲染对应的布局组件
       │
       ▼
6. 状态持久化到 localStorage
```

---

## 三、布局模式详解

### 3.1 基础布局 (lee-basic-layout)

**结构示意图**：

```text
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
│ ┌─────────┬────────────────────────────────────────────────┐│
│ │ Logo    │  搜索框  │ 通知 │ 主题 │ 语言 │ 布局 │ 用户   ││
│ └─────────┴────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │ Content                                          │
│ ┌───────┐│ ┌──────────────────────────────────────────────┐│
│ │ 菜单   ││ │ Breadcrumb                                   ││
│ │       ││ ├──────────────────────────────────────────────┤│
│ │       ││ │                                              ││
│ │       ││ │ Page Content (Outlet)                       ││
│ │       ││ │                                              ││
│ └───────┘│ └──────────────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────────────┘
```

**特点**：
- Logo 在 Header 左侧
- Sidebar 在左侧，可折叠
- Header 固定在顶部
- 适合大多数后台管理系统

**组件结构**：

```tsx
<Layout className="lee-basic-layout">
  <Header />
  <Layout className="layout-main">
    <Sidebar />
    <div className="layout-divider" />
    <Layout className="layout-content">
      <LayoutBreadcrumb />
      <Content className="content-wrapper">
        <Outlet />
      </Content>
    </Layout>
  </Layout>
</Layout>
```

### 3.2 侧边栏布局 (lee-sidebar-layout)

**结构示意图**：

```text
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│ Sidebar  │ Content                                          │
│ ┌───────┐│ ┌──────────────────────────────────────────────┐│
│ │ Logo  ││ │ Breadcrumb  │ 通知 │ 主题 │ 语言 │ 布局 │ 用户││
│ ├───────┤│ ├──────────────────────────────────────────────┤│
│ │       ││ │                                              ││
│ │ 菜单   ││ │ Page Content (Outlet)                       ││
│ │       ││ │                                              ││
│ │       ││ │                                              ││
│ │       ││ │                                              ││
│ └───────┘│ └──────────────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────────────┘
```

**特点**：
- Logo 在 Sidebar 顶部
- 无独立 Header，功能按钮在面包屑区域
- 侧边栏占据全部高度
- 适合侧边栏导航为主的应用

**组件结构**：

```tsx
<Layout className="lee-sidebar-layout">
  <Sidebar />
  <div className="layout-divider" />
  <Layout className="layout-main">
    <Layout className="layout-content">
      <LayoutBreadcrumb />
      <Content className="content-wrapper">
        <Outlet />
      </Content>
    </Layout>
  </Layout>
</Layout>
```

### 3.3 顶部菜单布局 (lee-top-menu-layout)

**结构示意图**：

```text
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
│ ┌─────────┬──────────────────────┬─────────────────────────┐│
│ │ Logo    │ 菜单导航             │ 搜索 │ 通知 │ 主题 │ 用户││
│ └─────────┴──────────────────────┴─────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ Content                                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Breadcrumb                                               ││
│ ├─────────────────────────────────────────────────────────┤│
│ │                                                         ││
│ │ Page Content (Outlet)                                   ││
│ │                                                         ││
│ │                                                         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**特点**：
- 菜单在 Header 中水平展示
- 无侧边栏
- 内容区域更宽
- 适合菜单层级较少的应用

**组件结构**：

```tsx
<Layout className="lee-topmenu-layout">
  <Header />
  <Layout className="layout-top-main">
    <LayoutBreadcrumb />
    <Content className="content-wrapper">
      <Outlet />
    </Content>
  </Layout>
</Layout>
```

---

## 四、布局文件结构

### 4.1 整体目录结构

```text
src/layout/
├── index.tsx                       # LayoutManager 入口
├── main.ts                         # 导出文件
├── readme.md                       # 布局说明文档
│
├── lee-basic-layout/               # 基础布局
│   ├── index.tsx                   # 布局入口
│   ├── header/                     # 头部组件
│   │   ├── index.tsx
│   │   └── styles.scss
│   ├── sidebar/                    # 侧边栏组件
│   │   ├── index.tsx
│   │   └── styles.scss
│   ├── breadcrumb/                 # 面包屑组件
│   │   ├── index.tsx
│   │   └── styles.scss
│   ├── menu-collapse-btn/          # 折叠按钮
│   │   ├── index.tsx
│   │   └── styles.scss
│   └── styles/                     # 布局样式
│       ├── index.scss
│       └── theme/                  # 主题样式
│           ├── index.scss
│           ├── common/
│           ├── light/
│           └── dark/
│
├── lee-sidebar-layout/             # 侧边栏布局
│   └── ...                         # 同上结构
│
├── lee-top-menu-layout/            # 顶部菜单布局
│   └── ...                         # 同上结构
│
├── constants/                      # 布局常量
│   └── menuConfig.ts               # 菜单配置
│
├── hooks/                          # 布局 Hooks
│   ├── index.ts                    # 导出文件
│   ├── use-antd-config.ts          # Ant Design 配置
│   ├── use-header.ts               # Header 逻辑
│   ├── use-i18n.ts                 # 国际化 Hook
│   ├── use-layout.ts               # 布局 Hook
│   ├── use-menu.ts                 # 菜单 Hook
│   └── use-theme.ts                # 主题 Hook
│
├── i18n/                           # 布局国际化
│   ├── index.ts
│   ├── zh-CN/
│   └── en-US/
│
├── stores/                         # 布局状态
│   ├── index.ts                    # 导出文件
│   ├── layoutStore.ts              # 布局状态
│   ├── themeStore.ts               # 主题状态
│   ├── i18nStore.ts                # 语言状态
│   └── menuStore.ts                # 菜单状态
│
├── themes/                         # 布局主题变量
│   ├── index.scss
│   └── variables.scss
│
└── utils/                          # 布局工具函数
    └── index.ts
```

### 4.2 LayoutManager 入口 (index.tsx)

```typescript
/**
 * 布局管理器 - 唯一对外暴露的接口
 * 根据配置的布局模式渲染对应的布局组件
 */
import { useLayoutStore } from './stores/layoutStore';
import LeeBasicLayout from './lee-basic-layout';
import LeeSidebarLayout from './lee-sidebar-layout';
import LeeTopMenuLayout from './lee-top-menu-layout';

const LayoutManager = () => {
  const { layoutMode } = useLayoutStore();

  const renderLayout = () => {
    switch (layoutMode) {
      case 'lee-basic':
        return <LeeBasicLayout />;
      case 'lee-sidebar':
        return <LeeSidebarLayout />;
      case 'lee-top-menu':
        return <LeeTopMenuLayout />;
      default:
        return <LeeBasicLayout />;
    }
  };

  return renderLayout();
};

export default LayoutManager;
```

---

## 五、布局状态管理

### 5.1 布局状态 (layoutStore.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutState {
  layoutMode: 'lee-basic' | 'lee-sidebar' | 'lee-top-menu';
  sidebarCollapsed: boolean;
  setLayoutMode: (mode: 'lee-basic' | 'lee-sidebar' | 'lee-top-menu') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      layoutMode: 'lee-basic',
      sidebarCollapsed: false,
      
      setLayoutMode: (layoutMode) => {
        set({ layoutMode });
      },
      
      toggleSidebar: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: 'layout-storage',
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
```

### 5.2 菜单状态 (menuStore.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuState {
  openKeys: string[];
  selectedKeys: string[];
  setOpenKeys: (keys: string[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  resetMenuState: () => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      openKeys: [],
      selectedKeys: [],
      
      setOpenKeys: (openKeys) => set({ openKeys }),
      setSelectedKeys: (selectedKeys) => set({ selectedKeys }),
      resetMenuState: () => set({ openKeys: [], selectedKeys: [] }),
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys,
      }),
    }
  )
);
```

### 5.3 布局 Hook (use-layout.ts)

```typescript
import { useLayoutStore } from '../stores/layoutStore';

export const useLayout = () => {
  const { 
    layoutMode, 
    sidebarCollapsed, 
    setLayoutMode, 
    toggleSidebar,
    setSidebarCollapsed 
  } = useLayoutStore();
  
  const isBasicLayout = layoutMode === 'lee-basic';
  const isSidebarLayout = layoutMode === 'lee-sidebar';
  const isTopMenuLayout = layoutMode === 'lee-top-menu';
  
  return {
    layoutMode,
    sidebarCollapsed,
    setLayoutMode,
    toggleSidebar,
    setSidebarCollapsed,
    isBasicLayout,
    isSidebarLayout,
    isTopMenuLayout,
  };
};
```

---

## 六、布局组件开发

### 6.1 Header 组件

```tsx
// lee-basic-layout/header/index.tsx
import { Layout, Button, Dropdown, Space, Avatar, Switch, Badge } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  BulbOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useHeader } from '../../hooks/use-header';
import './styles.scss';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { t } = useTranslation();
  const {
    theme,
    locale,
    userInfo,
    sidebarCollapsed,
    userMenuItems,
    languageMenuItems,
    layoutMenuItems,
    setTheme,
    handleUserMenuClick,
    handleLanguageMenuClick,
    handleLayoutMenuClick,
  } = useHeader();

  return (
    <AntHeader className="layout-header">
      {/* 左侧：Logo */}
      <div className="header-left">
        <div className="header-logo">
          <img src="/logo.svg" className="logo-icon" alt="Logo" />
          {!sidebarCollapsed && (
            <span className="logo-text">{t('lee-layout-webSite.name')}</span>
          )}
        </div>
      </div>

      {/* 右侧：功能按钮 */}
      <div className="header-right">
        <Space size="middle">
          {/* 搜索框 */}
          <div className="header-search">
            <SearchOutlined />
            <input placeholder={t('lee-layout-header.searchMenuPlaceholder')} />
          </div>

          {/* 通知 */}
          <Badge count={5} size="small">
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>

          {/* 主题切换 */}
          <Switch
            checked={theme === 'dark'}
            onChange={checked => setTheme(checked ? 'dark' : 'light')}
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
          />

          {/* 语言切换 */}
          <Dropdown menu={{ items: languageMenuItems, onClick: handleLanguageMenuClick }}>
            <Button icon={<GlobalOutlined />}>
              {locale === 'zh-CN' ? t('lee-layout-header.langZhShort') : t('lee-layout-header.langEnShort')}
            </Button>
          </Dropdown>

          {/* 布局切换 */}
          <Dropdown menu={{ items: layoutMenuItems, onClick: handleLayoutMenuClick }}>
            <Button icon={<MenuFoldOutlined />}>{t('lee-layout-header.layout')}</Button>
          </Dropdown>

          {/* 用户菜单 */}
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
            <div className="header-user">
              <Avatar src={userInfo?.avatar} icon={<UserOutlined />} size="small" />
              <span className="user-name">{userInfo?.nickname || userInfo?.username}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
```

### 6.2 Sidebar 组件

```tsx
// lee-basic-layout/sidebar/index.tsx
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../../hooks/use-menu';
import { useLayoutStore } from '../../stores/layoutStore';
import MenuCollapseBtn from '../menu-collapse-btn';
import './styles.scss';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useLayoutStore();
  const { menuItems, openKeys, selectedKeys, handleOpenChange, handleSelect } = useMenu();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      navigate(key);
    }
    handleSelect([key]);
  };

  return (
    <Sider
      className="layout-sider"
      collapsed={sidebarCollapsed}
      collapsedWidth={80}
      width={256}
      trigger={null}
    >
      <div className="sider-content">
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          items={menuItems}
          className="layout-menu"
        />
      </div>
      <MenuCollapseBtn />
    </Sider>
  );
};

export default Sidebar;
```

### 6.3 Breadcrumb 组件

```tsx
// lee-basic-layout/breadcrumb/index.tsx
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { asyncRoutes } from '@/router/routes';
import './styles.scss';

const LayoutBreadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];

    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const route = findRouteByPath(asyncRoutes, currentPath);
      
      if (route?.meta) {
        items.push({
          key: currentPath,
          title: route.meta.i18n ? t(route.meta.i18n) : route.meta.title,
        });
      }
    }

    return items;
  }, [location.pathname, t]);

  return (
    <div className="layout-breadcrumb">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default LayoutBreadcrumb;
```

### 6.4 MenuCollapseBtn 组件

```tsx
// lee-basic-layout/menu-collapse-btn/index.tsx
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useLayoutStore } from '../../stores/layoutStore';
import './styles.scss';

const MenuCollapseBtn = () => {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <div className="menu-collapse-btn" onClick={toggleSidebar}>
      {sidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
    </div>
  );
};

export default MenuCollapseBtn;
```

---

## 七、使用方法

### 7.1 在路由中使用布局

```typescript
// src/router/routes.ts
export const asyncRoutes: RouteItem[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout'),  // 引入 LayoutManager
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard'),
        meta: {
          title: '仪表盘',
          i18n: 'lee-layout-routes.Dashboard',
          icon: 'DashboardOutlined',
        },
      },
      // ... 更多路由
    ],
  },
];
```

### 7.2 切换布局模式

```tsx
import { useLayout } from '@/layout/hooks/use-layout';

const LayoutSelector = () => {
  const { layoutMode, setLayoutMode } = useLayout();
  
  return (
    <div>
      <button onClick={() => setLayoutMode('lee-basic')}>基础布局</button>
      <button onClick={() => setLayoutMode('lee-sidebar')}>侧边栏布局</button>
      <button onClick={() => setLayoutMode('lee-top-menu')}>顶部菜单布局</button>
    </div>
  );
};
```

### 7.3 控制侧边栏折叠

```tsx
import { useLayout } from '@/layout/hooks/use-layout';

const SidebarControl = () => {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useLayout();
  
  return (
    <div>
      <p>侧边栏状态: {sidebarCollapsed ? '折叠' : '展开'}</p>
      <button onClick={toggleSidebar}>切换</button>
      <button onClick={() => setSidebarCollapsed(true)}>折叠</button>
      <button onClick={() => setSidebarCollapsed(false)}>展开</button>
    </div>
  );
};
```

### 7.4 获取当前布局信息

```tsx
import { useLayout } from '@/layout/hooks/use-layout';

const LayoutInfo = () => {
  const { 
    layoutMode, 
    isBasicLayout, 
    isSidebarLayout, 
    isTopMenuLayout 
  } = useLayout();
  
  return (
    <div>
      <p>当前布局: {layoutMode}</p>
      {isBasicLayout && <p>使用基础布局</p>}
      {isSidebarLayout && <p>使用侧边栏布局</p>}
      {isTopMenuLayout && <p>使用顶部菜单布局</p>}
    </div>
  );
};
```

---

## 八、新增布局模式指南

### 8.1 创建新布局步骤

1. **创建布局目录**

```bash
mkdir -p src/layout/lee-new-layout/{header,sidebar,breadcrumb,styles/theme/{common,light,dark}}
```

2. **创建布局入口组件**

```tsx
// src/layout/lee-new-layout/index.tsx
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './header';
import Sidebar from './sidebar';
import LayoutBreadcrumb from './breadcrumb';
import './styles/index.scss';

const { Content } = Layout;

const LeeNewLayout = () => {
  return (
    <Layout className="lee-new-layout">
      <Header />
      <Layout className="layout-main">
        <Sidebar />
        <Layout className="layout-content">
          <LayoutBreadcrumb />
          <Content className="content-wrapper">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LeeNewLayout;
```

3. **创建布局样式**

```scss
// src/layout/lee-new-layout/styles/index.scss
@use './theme/index.scss' as *;

.lee-new-layout {
  height: 100vh;
  overflow: hidden;

  .layout-main {
    // 布局样式
  }

  .layout-content {
    // 内容区样式
  }

  .content-wrapper {
    // 内容包装器样式
  }
}
```

4. **创建主题样式**

```scss
// src/layout/lee-new-layout/styles/theme/index.scss
@use './light/index.scss' as *;
@use './dark/index.scss' as *;

:root {
  @extend .theme-light;
}

[data-theme='dark'] {
  @extend .theme-dark;
}
```

5. **更新布局类型定义**

```typescript
// src/layout/stores/layoutStore.ts
export interface LayoutState {
  layoutMode: 'lee-basic' | 'lee-sidebar' | 'lee-top-menu' | 'lee-new';  // 新增
  // ...
}
```

6. **在 LayoutManager 中注册**

```typescript
// src/layout/index.tsx
import LeeNewLayout from './lee-new-layout';

const LayoutManager = () => {
  const { layoutMode } = useLayoutStore();

  const renderLayout = () => {
    switch (layoutMode) {
      case 'lee-basic':
        return <LeeBasicLayout />;
      case 'lee-sidebar':
        return <LeeSidebarLayout />;
      case 'lee-top-menu':
        return <LeeTopMenuLayout />;
      case 'lee-new':  // 新增
        return <LeeNewLayout />;
      default:
        return <LeeBasicLayout />;
    }
  };

  return renderLayout();
};
```

7. **添加布局切换选项**

```typescript
// src/layout/constants/menuConfig.ts
export const createMenuConfig = (t: TFunction) => ({
  layoutMenuItems: [
    { key: 'lee-basic', label: t('lee-layout-layout.basic') },
    { key: 'lee-sidebar', label: t('lee-layout-layout.sidebar') },
    { key: 'lee-top-menu', label: t('lee-layout-layout.topMenu') },
    { key: 'lee-new', label: t('lee-layout-layout.newLayout') },  // 新增
  ],
});
```

---

## 九、最佳实践

### 9.1 组件复用

```tsx
// ✅ 推荐：提取公共组件
// 在 hooks 中封装公共逻辑
export const useHeader = () => {
  // 所有布局共享的 Header 逻辑
};

// 各布局的 Header 组件可以复用这个 Hook
const Header = () => {
  const headerProps = useHeader();
  return <HeaderUI {...headerProps} />;
};
```

### 9.2 样式隔离

```scss
// ✅ 推荐：使用布局前缀隔离样式
.lee-basic-layout {
  .layout-header { /* 基础布局 Header 样式 */ }
}

.lee-sidebar-layout {
  .layout-header { /* 侧边栏布局 Header 样式 */ }
}

// ❌ 避免：使用全局样式
.layout-header { /* 可能影响所有布局 */ }
```

### 9.3 主题变量规范

```scss
// ✅ 推荐：按布局分类变量
--lee-basic-header-bg: #ffffff;
--lee-sidebar-header-bg: #1f1f1f;
--lee-top-menu-header-bg: #001529;

// ❌ 避免：使用通用变量
--header-bg: #ffffff;  // 无法区分布局
```

### 9.4 状态管理

```typescript
// ✅ 推荐：使用独立的 Store
// layoutStore - 布局相关状态
// themeStore - 主题相关状态
// menuStore - 菜单相关状态

// ❌ 避免：将所有状态放在一个 Store
const useAllLayoutStore = create((set) => ({
  layoutMode: 'lee-basic',
  theme: 'light',
  locale: 'zh-CN',
  openKeys: [],
  // ... 太多状态
}));
```

### 9.5 性能优化

```tsx
// ✅ 推荐：使用 React.memo 优化组件
const Sidebar = React.memo(() => {
  // 组件内容
});

// ✅ 推荐：使用 useMemo 缓存菜单数据
const menuItems = useMemo(() => {
  return generateMenuItems(routes, t);
}, [routes, t]);
```

### 9.6 布局开发检查清单

- [ ] 布局组件结构清晰
- [ ] 样式使用布局前缀隔离
- [ ] 主题变量完整（light/dark）
- [ ] 国际化文案完整
- [ ] 在 LayoutManager 中注册
- [ ] 布局切换菜单已添加
- [ ] 响应式适配
- [ ] 各布局间可正常切换

---

## 📚 参考资料

| 资源 | 链接 |
|------|------|
| Ant Design Layout | [ant.design/components/layout](https://ant.design/components/layout) |
| React Router | [reactrouter.com](https://reactrouter.com/) |
| Zustand | [docs.pmnd.rs/zustand](https://docs.pmnd.rs/zustand) |
| CSS Grid Layout | [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) |

---

## 📝 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-01-21 | 初始版本，基于项目实际实现编写 |

---

> **文档维护**: 如有问题或建议，请联系项目负责人或在项目仓库提交 Issue。
