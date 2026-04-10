const n=`# React 企业级项目框架设计规范（Vite 架构版）

> **版本**: v2.0.0
> **更新时间**: 2026-01-29 13:17
> **技术栈**: React 19 + TypeScript + Vite 7 + Zustand + Ant Design 6 + TailwindCSS 4
> **AI 架构**: 引入 AI 架构设计，支持 AI 辅助开发
> **浏览器兼容性**: Chrome 90+, Edge 90+, Firefox 88+, Safari 14+ (不支持 IE)
> **项目规模**: 中大型企业级应用（支持10+开发者协作）
> **Node版本**: >= 18.0.0
> 权限系统、日志系统、国际化系统、布局切换、主题系统、通信系统、缓存系统、组件库系统、单点登录系统、文档系统、AI工具兼容

---

## 文档背景

> 文档的产生背景，是由0-1的框架搭建过程中，不断的补充文档，同时在项目框架搭建完成后，再次进行文档的重构和补充
> 所以你在这个文档中能发现，部分内容属于概念性的说明，但没有偏离实际，因为在框架的1完成后，在1的基础上完成的文档补充

## 📋 目录

- [一、概述](#一概述)
    - [1.1、适用场景](#11适用场景)
    - [1.2、技术栈概览](#12技术栈概览)
    - [1.3、浏览器兼容性](#13浏览器兼容性)
- [二、整体架构设计理念](#二整体架构设计理念)
    - [2.1、设计思想](#21设计思想)
    - [2.2、核心设计原则](#22核心设计原则)
    - [2.3、项目主架构图](#23项目主架构图)
    - [2.4、Layout布局架构图](#24Layout布局架构图)
    - [2.5、SSO单点登录设计](#25SSO单点登录设计)
- [三、项目根目录结构](#三项目根目录结构)
- [四、核心目录职责划分](#四核心目录职责划分)
    - [4.1、src目录](#41src目录)
    - [4.2、src_ai目录](#42src_ai目录)
    - [4.3、public目录](#43public目录)
    - [4.4、docs目录](#44docs目录)
    - [4.5、node_modules目录](#45node_modules目录)
    - [4.6、assets目录](#46assets目录)
    - [4.7、components目录](#47components目录)
    - [4.8、config目录](#48config目录)
    - [4.9、hooks目录](#49hooks目录)
    - [4.10、services目录](#410services目录)
    - [4.11、router目录](#411router目录)
    - [4.12、store目录](#412store目录)
    - [4.13、plugins目录](#413plugins目录)
    - [4.14、utils目录](#414utils目录)
    - [4.15、pages目录](#415pages目录)
    - [4.16、styles目录](#416styles目录)
    - [4.17、layout目录](#417layout目录)
        - [4.17.1、UUID工具](#4171UUID工具)
    - [4.18、i18n目录](#418i18n目录)
    - [4.19、types目录](#419types目录)
- [五、命名规范速查表](#五命名规范速查表)
    - [5.1、组件命名规范](#51组件命名规范)
    - [5.2、文件命名规范](#52文件命名规范)
    - [5.3、文件夹命名规范](#53文件夹命名规范)
    - [5.4、函数命名规范](#54函数命名规范)
    - [5.5、接口命名规范](#55接口命名规范)
    - [5.6、常量命名规范](#56常量命名规范)
    - [5.7、枚举命名规范](#57枚举命名规范)
    - [5.8、类型命名规范](#58类型命名规范)
    - [5.9、变量命名规范](#59变量命名规范)
    - [5.10、css样式命名规范](#510css样式命名规范)
    - [5.11、assets资源命名规范](#511assets资源命名规范)
- [六、项目配置文件](#六项目配置文件)
    - [6.1、npm配置文件](#61npm配置文件)
    - [6.2、vite配置文件](#62vite配置文件)
    - [6.3、ts配置文件](#63ts配置文件)
    - [6.4、eslint配置文件](#64eslint配置文件)
    - [6.5、prettier配置文件](#65prettier配置文件)
    - [6.6、vite环境变量配置文件](#66vite环境变量配置文件)
    - [6.7、tailwind配置文件](#67tailwind配置文件)
    - [6.8、postcss配置文件](#68postcss配置文件)
- [七、项目国际化设计](#七项目国际化设计)
    - [7.1、国际化系统设计概述](#71国际化系统设计概述)
    - [7.2、layout国际化控制](#72layout国际化控制)
    - [7.3、业务国际化控制](#73业务国际化控制)
- [八、项目layout布局设计](#八项目layout布局设计)
    - [8.1、布局系统概述](#81布局系统概述)
    - [8.2、三种布局方案](#82三种布局方案)
    - [8.3、项目主题色切换设计](#83项目主题色切换设计)
    - [8.4、项目国际化设计](#84项目国际化设计)
- [九、项目权限控制设计](#九项目权限控制设计)
    - [9.1、权限系统概述](#91权限系统概述)
    - [9.2、页面级权限控制](#92页面级权限控制)
    - [9.3、按钮级权限控制](#93按钮级权限控制)
    - [9.4、API接口级权限控制](#94API接口级权限控制)
    - [9.5、权限系统最佳实践](#95权限系统最佳实践)
- [十、项目ajax通信service设计](#十项目ajax通信service设计)
    - [10.1、HTTP通信架构概述](#101HTTP通信架构概述)
    - [10.2、通信方式对比](#102通信方式对比)
    - [10.3、Axios HTTP客户端](#103Axios-HTTP客户端)
    - [10.4、SSE流式通信](#104SSE流式通信)
    - [10.5、WebSocket双向通信](#105WebSocket双向通信)
    - [10.6、通信方式选择指南](#106通信方式选择指南)
    - [10.7、Services层组织规范](#107Services层组织规范)
- [十一、项目store状态管理库设计](#十一项目store状态管理库设计)
    - [11.1、状态管理概述](#111状态管理概述)
    - [11.2、Store架构](#112Store架构)
    - [11.3、核心Store说明](#113核心Store说明)
    - [11.4、Zustand最佳实践](#114Zustand最佳实践)
- [十二、项目日志架构设计](#十二项目日志架构设计)
    - [12.1、日志系统概述](#121日志系统概述)
    - [12.2、日志系统初始化](#122日志系统初始化)
    - [12.3、快速开始](#123快速开始)
    - [12.4、日志装饰器](#124日志装饰器)
    - [12.5、日志管理页面](#125日志管理页面)
- [十三、项目AI开发工具集成设计](#十三项目AI开发工具集成设计)
    - [13.1、AI工具支持](#131AI工具支持)
    - [13.2、AI知识库体系](#132AI知识库体系)
    - [13.3、AI配置文件](#133AI配置文件)
    - [13.4、src vs src_ai](#134src-vs-src_ai)
- [十四、docs项目文档规范](#十四docs项目文档规范)
    - [14.1、文档目录结构](#141文档目录结构)
    - [14.2、文档编写规范](#142文档编写规范)
    - [14.3、文档类型](#143文档类型)
    - [14.4、文档展示](#144文档展示)
- [十五、项目版本管理规范](#十五项目版本管理规范)
    - [15.1、版本号命名规则](#151版本号命名规则)
    - [15.2、版本发布规范](#152版本发布规范)
- [十六、Git 代码仓库管理规范](#十六Git-代码仓库管理规范)
    - [16.1、Git Tag 版本规范](#161Git-Tag-版本规范)
    - [16.2、分支管理策略](#162分支管理策略)
    - [16.3、分支合并规则](#163分支合并规则)
    - [16.4、Commit 提交规范](#164Commit-提交规范)
    - [16.5、Pull Request 规范](#165Pull-Request-规范)
    - [16.6、其他 Git 规范](#166其他-Git-规范)
- [十七、代码注释规范](#十七代码注释规范)
    - [17.1、变量、js/ts函数注释](#171变量js-ts函数注释)
    - [17.2、css样式注释](#172css样式注释)
    - [17.3、tsx文件注释](#173tsx文件注释)
    - [17.4、bash文件注释](#174bash文件注释)
    - [17.5、json文件注释](#175json文件注释)
- [十八、项目多模式版本拓展](#十八项目多模式版本拓展)
    - [18.1、纯前端模式](#181纯前端模式)
    - [18.2、Api 接口模式](#182Api接口模式)
    - [18.3、Mock 数据模拟模式](#183Mock数据模拟模式)
    - [18.4、koa sqllite 模式](#184koa-sqllite-模式)
- [十九、开发工具链](#十九开发工具链)
    - [19.1、开发命令](#191开发命令)
    - [19.2、推荐 VSCode 插件](#192推荐-VSCode-插件)
    - [19.3、浏览器插件](#193浏览器插件)
- [二十、最佳实践指南](#二十最佳实践指南)
    - [20.1、组件设计原则](#201组件设计原则)
    - [20.2、状态管理原则](#202状态管理原则)
    - [20.3、性能优化清单](#203性能优化清单)
    - [20.4、安全最佳实践](#204安全最佳实践)

---

## 一、概述

### 1.1、适用场景

| 场景类型                   | 说明                         |
| -------------------------- | ---------------------------- |
| 中后台管理系统             | OA、ERP、CRM 等企业应用      |
| 数据中台 / AI Agent 控制台 | 数据可视化、AI 交互界面      |
| SaaS 管理后台              | 多租户管理、订阅服务         |
| 多团队长期维护项目         | 需要标准化、可维护性高的项目 |

### 1.2、技术栈概览

| 技术 | 版本 | 用途 |
| ------------ | ---- | ----------- |
| React | 19.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 7.x | 构建工具 |
| Zustand | 5.x | 状态管理 |
| Ant Design | 6.x | UI 组件库 |
| TailwindCSS | 4.x | 原子化 CSS |
| React Router | 7.x | 路由管理 |
| i18next | 25.x | 国际化 |
| Axios | 1.x | HTTP 客户端 |
| SSE 客户端 | 自封装 | SSE 流式通信（见 src/layout/utils/sse.ts） |
| WebSocket 客户端 | 自封装 | WebSocket 双向通信（见 src/layout/utils/websocket.ts） |
| echarts | 6.x | 可视化图表库 |
| logic-flow | 2.x | 流程图操作库 |
| react-markdown | 10.x | markdown渲染库 |

### 1.3、浏览器兼容性

本项目基于现代浏览器特性开发，要求浏览器支持 ES2015+ 标准。

#### 支持的浏览器

| 浏览器 | 最低版本 | 推荐版本 | 说明 |
|--------|----------|----------|------|
| **Chrome** | 90+ | 最新版本 | 完全支持，推荐使用 |
| **Edge** | 90+ | 最新版本 | 基于 Chromium，完全支持 |
| **Firefox** | 88+ | 最新版本 | 完全支持 |
| **Safari** | 14+ | 最新版本 | macOS/iOS，完全支持 |
| **Opera** | 76+ | 最新版本 | 基于 Chromium，完全支持 |

#### 移动端支持

| 平台 | 最低版本 | 说明 |
|------|----------|------|
| **iOS Safari** | 14+ | iPhone/iPad |
| **Android Chrome** | 90+ | Android 8.0+ |
| **Android WebView** | 90+ | 混合应用 |

#### 不支持的浏览器

| 浏览器 | 说明 |
|--------|------|
| ❌ **Internet Explorer** | 所有版本均不支持 |
| ❌ **旧版 Edge** | EdgeHTML 内核版本不支持 |

#### 兼容性注意事项

1. **Node.js 版本要求**
   - 开发环境需要 Node.js 18+ 版本
   - 推荐使用 Node.js 20 LTS 版本

2. **CSS 特性依赖**
   - CSS Grid Layout
   - CSS Flexbox
   - CSS Custom Properties (CSS Variables)
   - CSS Container Queries (部分功能)

3. **JavaScript 特性依赖**
   - ES2015+ (ES6+) 语法
   - Promise、async/await
   - Optional Chaining (\`?.\`)
   - Nullish Coalescing (\`??\`)
   - Dynamic Import

4. **React 19 新特性**
   - React Server Components (如使用)
   - Automatic Batching
   - Transitions API

#### 兼容性验证方法

\`\`\`bash
# 在支持的浏览器中打开开发者工具
# 检查控制台是否有兼容性警告

# 推荐使用以下工具检测浏览器兼容性
# 1. Can I Use: https://caniuse.com/
# 2. Browserslist: npx browserslist
\`\`\`

#### Browserslist 配置

项目的 \`package.json\` 或 \`.browserslistrc\` 中配置：

\`\`\`json
{
  "browserslist": [
    "Chrome >= 90",
    "Edge >= 90",
    "Firefox >= 88",
    "Safari >= 14",
    "iOS >= 14",
    "Android >= 8",
    "not IE 11",
    "not dead"
  ]
}
\`\`\`

#### 降级方案

如需支持更低版本浏览器，可考虑：

1. **使用 Polyfill**
   \`\`\`bash
   npm install core-js regenerator-runtime
   \`\`\`

2. **调整构建配置**
   - 修改 Vite 配置中的 \`build.target\`
   - 添加必要的 Babel 插件

3. **功能降级**
   - 检测浏览器特性
   - 提供替代方案或友好提示

**注意**: 支持旧版浏览器会增加构建产物体积，影响性能，不推荐。


---

## 二、整体架构设计理念

> 思想之所以为思想，是因为它指导着我们行动的方向。

### 2.1、设计思想

本项目基于**企业级标准框架模板**的设计思想,旨在打造一个开箱即用、可直接运行、无警告无异常的React项目基础框架。

| 设计思想 | 说明 |
| -------- | ---- |
| **标准化** | 统一的目录结构、命名规范、代码风格,降低团队协作成本 |
| **模块化** | 业务模块自治,页面级组件/服务/状态独立管理 |
| **可扩展** | 支持主题色扩展、国际化扩展、布局扩展、AI代码生成扩展 |
| **工程化** | 完整的构建配置、代码检查、格式化、版本管理 |
| **企业级** | 内置权限系统、日志系统、错误处理、性能优化 |
| **AI友好** | 双目录架构(src + src_ai)、完整的AI知识库、规范的文档体系 |

### 2.2、核心设计原则

| 原则               | 说明                                | 实践方式                            |
| ------------------ | ----------------------------------- | ----------------------------------- |
| **业务解耦**       | 页面 / 状态 / 接口 / 组件分层清晰   | 按功能模块拆分目录                  |
| **模块自治**       | 每个业务模块可独立维护              | 页面内包含私有组件、hooks、services |
| **强约束命名规范** | 减少团队沟通成本                    | 统一使用 kebab-case                 |
| **插件化扩展能力** | 适应未来复杂需求                    | plugins 目录封装第三方能力          |
| **项目模式扩展能力**  | mock模式、api 接口模式、纯前端模式、koa-sqllite模式 | 分不同项目根据不同模式进行开发                  |

### 2.3、项目主架构图

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                        展示层 (Pages)                        │
│  路由级页面 - 业务逻辑入口 - 页面自治(组件+服务+状态)              │
├─────────────────────────────────────────────────────────────┤
│                      组件层 (Components)                      │
│  全局通用组件 + 页面私有组件 - UI复用                            │
├─────────────────────────────────────────────────────────────┤
│                       逻辑层 (Hooks)                          │
│  业务逻辑抽象 - 状态管理 + 副作用处理                         │
├─────────────────────────────────────────────────────────────┤
│                      数据层 (Services)                        │
│  API接口封装 - HTTP(Axios) + SSE + WebSocket - 数据获取      │
├─────────────────────────────────────────────────────────────┤
│                      状态层 (Store)                           │
│  全局状态管理 - Zustand - 用户/应用/主题/语言                │
├─────────────────────────────────────────────────────────────┤
│                      工具层 (Utils)                           │
│  纯函数工具 - 格式化/验证/存储/加密                           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2.4、Layout布局架构图

\`\`\`text
┌───────────────────────────────────────────────────────────────────┐
│                        Layout 布局系统                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  lee-basic-layout (基础布局 - 左侧菜单 + 顶部导航)      │     │
│  │  ├── header (头部导航栏)                                │     │
│  │  │   ├── logo                                           │     │
│  │  │   ├── breadcrumb (面包屑)                            │     │
│  │  │   ├── notifications (通知)                           │     │
│  │  │   ├── theme-switcher (主题切换)                       │     │
│  │  │   ├── i18n-switcher (语言切换)                        │     │
│  │  │   └── user-dropdown (用户菜单)                        │     │
│  │  └── sidebar (侧边栏菜单)                                │     │
│  │      ├── menu-collapse-btn (折叠按钮)                    │     │
│  │      └── menu-tree (菜单树)                              │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  lee-sidebar-layout (侧边栏布局)                        │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  lee-top-menu-layout (顶部菜单布局)                     │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ├── constants/ (布局常量配置)                                    │
│  ├── hooks/ (布局Hooks - use-theme / use-i18n / use-menu)       │
│  ├── stores/ (布局状态 - themeStore / i18nStore / layoutStore)  │
│  ├── themes/ (主题配置 - 支持明暗主题 + 自定义主题扩展)           │
│  ├── i18n/ (布局国际化 - zh-CN / en-US + 可扩展其他语言)         │
│  └── utils/ (布局工具 - LeeLogger / Navigation / Request)       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

### 2.5、SSO单点登录设计

本框架内置了完整的 SSO（Single Sign-On）单点登录支持，采用 **Token 传递 + Cookie 共享** 的双重验证机制，既支持跨域 Token 传递，也支持同域 Cookie 共享。

#### 2.5.1、核心设计流程

1. **入口设计**: 专门的 \`sso-loading\` 页面作为单点登录的中转站。
2. **验证策略**:
   - **策略A (URL Token)**: 优先检测 URL 参数中的 \`token\` (适用于跨域跳转)。
      + 参考 src/pages/sso-loading/index.tsx
   - **策略B (Cookie)**: 检测同域下的 \`authorization\` Cookie (适用于子系统间跳转)。
      + 参考 src/layout/utils/cookie.ts
      + 参考 src/pages/sso-loading/index.tsx
3. **鉴权闭环**:
   - 验证成功 -> 初始化用户信息 -> 初始化路由和菜单 -> 跳转 Dashboard。
   - 验证失败 -> 清除无效状态 -> 跳转 Login 页。
   - 参考 src/pages/sso-loading/index.tsx
4. **系统初始化**:
   - **路由初始化**: 根据用户权限过滤路由配置，更新 \`router-store\`
   - **菜单初始化**: 自动同步路由数据到 \`menu-store\`，构建菜单树
   - **权限初始化**: 加载用户权限标识，用于页面/按钮/API权限控制

#### 2.5.2、流程图解

\`\`\`text
[外部系统/认证中心] 
       │
       ▼
[本系统 /sso-loading] <───(携带 ?token=xyz)
       │
       ├── 1. 获取 Token (URL参数 or Cookie)
       │
       ▼
[服务端验证 Token]
       │
       ├── 成功 ──► [初始化 UserStore]
       │              │
       │              ▼
       │         [初始化路由系统]
       │              │
       │              ├─► filterRoutesByPerm() 权限过滤
       │              ├─► router-store.setRoutes() 更新路由
       │              └─► menu-store.setRoutesMenu() 更新菜单
       │              │
       │              ▼
       │         [进入 Dashboard]
       │
       └── 失败 ──► [清空状态] ──► [跳转 Login]
\`\`\`

#### 2.5.3、路由初始化详解

**文件位置**: \`src/pages/sso-loading/index.tsx\`

**核心代码**:
\`\`\`typescript
// 初始化项目各个子系统的配置
const initSubsystemConfig = (userInfo: any) => {
  const newRoutes = userInfo.routes;
  
  // 初始化路由系统
  initRoutes(newRoutes);
};

// 初始化路由系统
function initRoutes(newRoutes: any) {
  let allRoutes: RouteItem[];
  
  if (newRoutes && newRoutes.length > 0) {
    // 使用动态路由-由后端控制路由配置
    allRoutes = filterRoutesByPerm(staticRoutes, newRoutes);
  } else {
    // 使用静态路由-由前端控制路由配置
    allRoutes = filterRoutesByPerm(routes);
  }
  
  // 使用 store 更新路由配置（自动触发菜单更新）
  useRouterStore.getState().setRoutes(allRoutes);
}
\`\`\`

**两种路由模式**:
1. **后端动态路由模式**: 后端返回路由配置，前端进行权限过滤
2. **前端静态路由模式**: 前端存储全部路由，根据权限标识过滤

**自动联动**:
- \`router-store.setRoutes()\` 会自动调用 \`menu-store.setRoutesMenu()\`
- 菜单组件自动使用更新后的路由数据渲染菜单树
- 日志系统自动记录路由初始化过程

---

## 三、项目根目录结构

\`\`\`text
react19_ts/
├── public/                         # 静态资源(不参与构建)
│   └── vite.svg
│
├── src/                            # 源代码目录(手动编写)
│   ├── assets/                     # 静态资源(参与构建)
│   │   ├── fonts/                  # 字体文件
│   │   ├── icons/                  # 图标文件
│   │   └── images/                 # 图片文件(示例: logo.png)
│   │
│   ├── components/                 # 全局通用组件
│   │   └── (暂无,按需添加)
│   │
│   ├── config/                     # 全局配置中心
│   │   └── index.ts                # 应用配置/环境配置/路由配置
│   │
│   ├── hooks/                      # 通用 Hooks
│   │   ├── use-auth.ts             # 认证Hook
│   │   ├── use-permission.ts       # 权限Hook
│   │   └── use-routes.ts           # 路由Hook
│   │
│   ├── i18n/                       # 国际化资源(可扩展更多语言)
│   │   ├── index.ts                # i18n初始化配置
│   │   ├── en-US/                  # 英文资源
│   │   │   └── index.ts
│   │   └── zh-CN/                  # 中文资源
│   │       └── index.ts
│   │
│   ├── layout/                     # 系统级布局
│   │   ├── index.tsx               # 布局入口
│   │   ├── lee-basic-layout/       # 基础布局(左侧菜单+顶部导航)
│   │   │   ├── index.tsx
│   │   │   ├── breadcrumb/             # 面包屑组件
│   │   │   │   └── index.tsx
│   │   │   ├── header/                 # 头部组件
│   │   │   │   └── index.tsx
│   │   │   ├── menu-collapse-btn/  # 菜单折叠按钮
│   │   │   │   └── index.tsx
│   │   │   ├── sidebar/            # 侧边栏组件
│   │   │   │   └── index.tsx
│   │   │   └── styles/             # 布局样式
│   │   │       └── index.scss
│   │   ├── lee-sidebar-layout/     # 侧边栏布局
│   │   │   └── index.tsx
│   │   ├── lee-top-menu-layout/    # 顶部菜单布局
│   │   │   └── index.tsx
│   │   ├── constants/              # 布局常量
│   │   │   └── menuConfig.ts
│   │   ├── hooks/                  # 布局Hooks
│   │   │   ├── use-antd-config.ts  # Ant Design配置
│   │   │   ├── use-header.ts       # 头部Hook
│   │   │   ├── use-i18n.ts         # 国际化Hook
│   │   │   ├── use-layout.ts       # 布局Hook
│   │   │   ├── use-menu.ts         # 菜单Hook
│   │   │   └── use-theme.ts        # 主题Hook
│   │   ├── i18n/                   # 布局国际化(可扩展)
│   │   │   ├── en-US/              # 英文
│   │   │   │   └── index.ts    
│   │   │   └── zh-CN/              # 中文
│   │   │       └── index.ts    
│   │   ├── stores/                 # 布局状态管理
│   │   │   ├── i18nStore.ts        # 国际化状态
│   │   │   ├── layoutStore.ts      # 布局状态
│   │   │   ├── menuStore.ts        # 菜单状态
│   │   │   └── themeStore.ts       # 主题状态
│   │   ├── themes/                 # 布局主题(可扩展主题色)
│   │   │   ├── index.scss    
│   │   │   └── variables.scss    
│   │   └── utils/                  # 布局工具
│   │       ├── index.ts            # 统一导出
│   │       ├── leeLogger.ts        # 企业级日志系统(支持装饰器、自动上下文收集)
│   │       ├── leePermission.ts    # 权限控制系统(页面/按钮/API三级权限)
│   │       ├── navigation.ts       # 导航服务
│   │       ├── request.ts          # HTTP请求封装(Axios)
│   │       ├── sse.ts              # SSE客户端
│   │       ├── storage.ts          # 存储工具
│   │       ├── uuid.ts             # UUID生成工具(v4/v7等多版本支持)
│   │       └── websocket.ts        # WebSocket客户端
│   │   
│   ├── pages/                      # 路由级页面(核心业务)
│   │   ├── dashboard/              # 仪表盘
│   │   │   └── index.tsx   
│   │   ├── error/                  # 错误页面
│   │   │   ├── 401.tsx
│   │   │   ├── 403.tsx
│   │   │   ├── 404.tsx
│   │   │   ├── 500.tsx
│   │   │   └── (其他错误页)
│   │   ├── examples/               # 示例页面
│   │   │   ├── chart/              # 图表示例
│   │   │   ├── form/               # 表单示例
│   │   │   └── table/              # 表格示例
│   │   ├── login/                  # 登录页面
│   │   │   ├── index.tsx           # 登录组件
│   │   │   ├── register.tsx        # 注册组件
│   │   │   └── use-login.ts        # 登录Hook
│   │   ├── sso-loading/            # SSO 单点登录跳转页
│   │   │   └── index.tsx   
│   │   ├── profile/                # 个人中心
│   │   │   └── index.tsx   
│   │   ├── system-management/      # 系统管理
│   │   │   ├── user-management/    # 用户管理
│   │   │   │   └── index.tsx   
│   │   │   ├── role-management/    # 角色管理
│   │   │   │   └── index.tsx   
│   │   │   ├── menu-management/    # 菜单管理
│   │   │   │   └── index.tsx   
│   │   │   ├── dict-management/    # 字典管理
│   │   │   │   ├── index.tsx
│   │   │   │   └── dict-data.tsx   # 字典数据
│   │   │   ├── notice-management/  # 通知公告
│   │   │   │   └── index.tsx
│   │   │   ├── log-management/     # 日志管理
│   │   │   │   └── index.tsx
│   │   │   ├── sso-management/     # SSO 管理
│   │   │   │   └── index.tsx
│   │   │   ├── document-center/    # 文档中心
│   │   │   │   └── index.tsx
│   │   │   └── (其他系统管理页)
│   │   ├── (其他一级页面)
│   │
│   │   # 说明：
│   │   # - @AI/@ai 别名指向 src_ai 目录（在 vite.config.ts 中配置）
│   │   # - AI 生成的独立功能或大型代码（≥500行）放在 src_ai/
│   │   # - 如需引用 AI 代码：import { Component } from '@AI/components/...'
│   │
│   │   #### SSO 单点登录功能介绍
│   │   # 该功能主要由 sso-loading 页面承载，流程如下：
│   │   # 1. 外部系统跳转至本系统时携带 token 参数 (e.g., /sso-loading?token=xyz)
│   │   # 2. sso-loading 页面解析 URL 参数获取 token
│   │   # 3. 或通过同域名下的cookie进行token验证
│   │   # 4. 调用 loginService.checkToken(token) 验证有效性
│   │   # 5. 验证通过：存储 token 至全局状态和 Cookie，跳转至 Dashboard
│   │   # 6. 验证失败：跳转至 Login 页面需重新登录
│   │
│   ├── plugins/                  # 插件封装
│   │   ├── i18n.ts               # 国际化插件
│   │   └── logger.ts             # 日志插件
│   │ 
│   ├── router/                   # 路由系统
│   │   ├── index.tsx             # 路由入口
│   │   ├── routes.ts             # 路由配置(静态+动态)
│   │   └── routes.tsx            # 路由组件
│   │ 
│   ├── services/                 # 全局API服务层
│   │   ├── index.ts              # 统一导出
│   │   ├── dashboard/            # 仪表盘服务
│   │   │   └── index.ts
│   │   ├── login-service/        # 登录服务
│   │   │   └── index.ts
│   │   ├── menu/                 # 菜单服务
│   │   │   └── index.ts
│   │   ├── role/                 # 角色服务
│   │   │   └── index.ts
│   │   └── user/                 # 用户服务
│   │       └── index.ts
│   │
│   ├── store/                    # 全局状态管理(Zustand)
│   │   ├── index.ts              # 统一导出
│   │   ├── app.ts                # 应用状态(主题/语言/布局)
│   │   └── user.ts               # 用户状态(用户信息/权限/token)
│   │ 
│   ├── styles/                   # 全局样式体系
│   │   ├── global.scss           # 全局样式入口
│   │   ├── lee.scss              # 自定义样式
│   │   ├── mixins.scss           # SCSS混入
│   │   ├── reset.scss            # 样式重置
│   │   └── variables.scss        # SCSS变量(主题色/间距等)
│   │ 
│   ├── types/                    # 全局TS类型定义
│   │   ├── index.ts              # 统一导出
│   │   ├── route.ts              # 路由类型
│   │   └── user.ts               # 用户类型
│   │ 
│   ├── utils/                    # 工具函数
│   │   ├── index.ts              # 统一导出
│   │   ├── auth.ts               # 认证工具
│   │   ├── globalAntd.tsx        # Ant Design全局配置
│   │   └── use-sse.tsx           # SSE Hook
│   │ 
│   ├── App.tsx                   # 应用入口组件
│   ├── index.css                 # 全局样式入口
│   └── main.tsx                  # 应用启动入口
│ 
├── src_ai/                       # AI代码目录(AI生成)
│   ├── ai-knowledge/             # AI知识库
│   │   ├── readme.md             # 知识库说明
│   │   ├── llms.txt.md           # llms.txt标准文档
│   │   ├── lee-custom-llms-text/   # 项目自定义知识库
│   │   │   ├── llms.txt          # 简洁版AI知识库
│   │   │   └── llms.full.txt     # 完整版AI知识库
│   │   ├── ant-design-llms-text/   # Ant Design知识库
│   │   │   ├── readme.md
│   │   │   ├── llms.txt
│   │   │   └── llms-full.txt
│   │   └── ai-tools-config/        # AI工具配置文档
│   │       ├── Cursor.md           # Cursor配置指南
│   │       ├── Windsurf.md         # Windsurf配置指南
│   │       ├── Antigravity.md      # Antigravity配置指南
│   │       ├── Qoder.md            # Qoder配置指南
│   │       ├── Kiro.md             # Kiro配置指南
│   │       └── VScode.md           # VSCode配置指南
│   ├── components/                 # AI生成的组件
│   ├── pages/                      # AI生成的页面
│   │   └── user-management/        # 用户管理(AI生成示例)
│   ├── assets/                     # AI生成的资源
│   ├── test/                       # AI生成的测试
│   └── readme.md                   # AI目录说明
│
├── docs/                           # 项目文档
│   ├── 项目开发规范/
│   │   └── React 企业级项目框架设计规范.md
│   ├── 项目设计方案/
│   └── 项目需求/
│
├── .vscode/                    # VSCode配置
│   └── settings.json           # 工作区配置(含AI扩展)
│
├── .windsurf/                  # Windsurf AI配置
│   └── config.json
│
├── .antigravity/               # Antigravity AI配置
│   └── config.yaml
│
├── .continue/                  # Continue AI配置
│   └── config.json
│
├── .cursorrules                # Cursor AI规则
├── .qoder.json                 # Qoder AI配置
├── .kiro.yaml                  # Kiro AI配置
│
├── .editorconfig               # 编辑器配置
├── .env.development            # 开发环境变量
├── .env.mock                   # Mock环境变量
├── .env.preview                # 预览环境变量
├── .env.production             # 生产环境变量
├── .eslintrc.cjs               # ESLint配置(旧版)
├── .gitignore                  # Git忽略文件
├── .prettierrc                 # Prettier配置
├── .prettierignore             # Prettier忽略文件
├── .stylelintrc.cjs            # Stylelint配置
├── eslint.config.js            # ESLint配置(Flat Config)
├── index.html                  # HTML模板
├── package.json                # 项目依赖配置
├── postcss.config.js           # PostCSS配置
├── tailwind.config.js          # TailwindCSS配置
├── tsconfig.app.json           # TypeScript应用配置
├── tsconfig.json               # TypeScript主配置
├── tsconfig.node.json          # TypeScript Node配置
├── version-log.md              # 版本日志
├── vite.config.ts              # Vite配置
└── README.md                   # 项目说明
\`\`\`

---

## 四、核心目录职责划分

### 4.1、src目录

**说明**: 项目的核心源代码目录，包含所有的业务逻辑、组件、样式和配置。开发工作主要在此目录下进行。

\`\`\`text
src/
├── assets/         # 静态资源
├── components/     # 全局通用组件
├── config/         # 全局配置
├── hooks/          # 通用 Hooks
├── layout/         # 系统级布局
├── pages/          # 业务页面
├── plugins/        # 插件扩展
├── router/         # 路由系统
├── services/       # API 服务
├── store/          # 全局状态
├── styles/         # 全局样式
├── utils/          # 工具函数
└── App.tsx         # 应用入口
\`\`\`

---

### 4.2、src_ai目录

\`\`\`text
src_ai/
├── ai-knowledge/         # AI知识库
│   ├── lee-custom-llms-text/
│   └── ant-design-llms-text/
├── components/           # AI生成的组件
├── pages/                # AI生成的页面
└── readme.md             # AI目录说明
\`\`\`

**用途**: 存放AI工具生成的代码,测试后移入src/

**详细说明**: 见[第十三章、项目AI开发工具集成设计](#十三项目AI开发工具集成设计)

---

### 4.3、public目录

\`\`\`text
public/
├── favicon.ico           # 网站图标
├── logo.png              # 应用Logo
└── robots.txt            # 搜索引擎爬虫配置（可选）

# 注意：index.html 位于项目根目录，不在 public 目录
\`\`\`

**规范要求**:

| 规则 | 说明 |
| ---- | ---- |
| ✅ 直接访问资源 | 通过\`/\`路径直接访问 |
| ❌ 不经过构建 | 文件不会被Vite处理 |
| ✅ 固定资源 | 放置favicon、robots.txt等 |

---

### 4.4、docs目录

\`\`\`text
docs/
├── 项目开发规范/
│   └── React 企业级项目框架设计规范.md
├── 项目设计方案/
└── 项目需求/
\`\`\`

**文档类型**:
- **开发规范**: 编码规范、架构设计
- **设计方案**: 功能设计、技术方案
- **需求文档**: 业务需求、功能需求

---

### 4.5、node_modules目录

**说明**: Node.js 项目依赖包存放目录，由包管理器（npm/yarn/pnpm）自动维护。

**规范要求**:
- ❌ **禁止手动修改**: 任何对 node_modules 的修改都会在下一次安装依赖时丢失。
- ❌ **禁止提交**: 该目录应被加入 \`.gitignore\`。

---

### 4.6、assets目录

\`\`\`text
assets/
├── fonts/          # 字体文件（.woff, .woff2, .ttf）
├── icons/          # 图标文件（.svg, .png）
└── images/         # 图片文件（.png, .jpg, .webp）
\`\`\`

**规范要求**：

| 规则              | 说明                     |
| ----------------- | ------------------------ |
| ✅ 只放静态资源   | 图片、字体、图标等       |
| ❌ 禁止放组件代码 | 组件应放在 components    |
| ❌ 禁止放业务逻辑 | 业务逻辑应放在 pages     |
| ✅ 支持引用路径   | 使用 \`@/assets/...\` 引用 |

---

### 4.7、components目录

\`\`\`text
components/
├── page-header/
│   ├── index.tsx           # 组件入口
│   ├── styles.module.scss  # 组件样式
│   └── types.ts            # 类型定义
│
├── permission/             # 权限组件
├── loading/                # 加载组件
└── error-boundary/         # 错误边界
\`\`\`

**规范要求**：

| 规则                    | 说明             |
| ----------------------- | ---------------- |
| ✅ 一个组件一个目录     | 便于管理和维护   |
| ✅ 使用 kebab-case 命名 | 如 \`page-header\` |
| ✅ 入口文件为 index.tsx | 便于导入         |
| ❌ 不依赖具体业务       | 保持通用性       |
| ✅ 包含类型定义         | 使用 types.ts    |

---

### 4.8、config目录

\`\`\`text
config/
└── index.ts              # 应用配置(名称/版本/默认语言/主题/分页等)
\`\`\`

**配置内容**:

\`\`\`typescript
export const appConfig = {
  name: "React Admin",
  version: "1.0.0",
  description: "基于 React 19 的企业级后台管理系统",
  defaultLocale: "zh-CN",
  defaultTheme: "light",
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: ["10", "20", "50", "100"],
  },
  // ... 更多配置
};
\`\`\`

**文件位置**: \`src/config/index.ts\`

---

### 4.9、hooks目录

\`\`\`text
hooks/
├── use-auth.ts            # 认证相关
├── use-permission.ts      # 权限相关
└── use-routes.ts          # 路由相关
\`\`\`

**规范要求**：

| 规则                  | 说明                                    |
| --------------------- | --------------------------------------- |
| ✅ 必须 use 开头      | 如 \`use-auth.ts\`                        |
| ✅ 一个 hook 一个文件 | 保持单一职责                            |
| ✅ 导出命名 Hook      | 如 \`export const useAuth = () => {...}\` |
| ❌ 禁止包含 UI        | Hooks 只处理逻辑                        |

---

### 4.10、services目录

\`\`\`text
services/
├── index.ts                # 统一导出所有服务
├── dashboard/              # 仪表盘服务
│   └── index.ts
├── login-service/          # 登录服务
│   └── index.ts
├── menu/                   # 菜单服务
│   └── index.ts
├── role/                   # 角色服务
│   └── index.ts
└── user/                   # 用户服务
    └── index.ts
\`\`\`

**规范要求**：

| 规则                  | 说明                            |
| --------------------- | ------------------------------- |
| ❌ 不直接在页面写请求 | 请求统一封装                    |
| ✅ 调用链路           | 页面 → services → utils/request |
| ✅ 按业务模块拆分     | 一个模块一个文件                |
| ✅ 返回类型定义       | 使用 TypeScript 泛型            |

**服务层示例**：

\`\`\`typescript
// services/user.ts
import request from '@/utils/request';
import type { User, UserListParams, UserListResponse } from '@/types/user';

export const getUserListService = (params: UserListParams) => {
  return request.get<UserListResponse>('/api/users', { params });
};
\`\`\`

---

### 4.11、router目录

\`\`\`text
router/
├── index.tsx              # 路由入口
├── routes.ts              # 静态路由定义
└── routes.tsx             # 路由组件
\`\`\`

**支持能力**：

| 能力         | 说明                         |
| ------------ | ---------------------------- |
| ✅ 动态菜单  | 根据权限动态生成菜单         |
| ✅ 权限路由  | 路由级别权限控制             |
| ✅ Meta 配置 | title / icon / auth / layout |
| ✅ 懒加载    | 使用 React.lazy 按需加载     |
| ✅ 路由守卫  | 登录验证、权限校验           |

---

### 4.12、store目录

\`\`\`text
store/
├── index.ts               # 统一导出
├── app.ts                 # 应用级状态（主题 / 语言 / 布局）
└── user.ts                # 用户状态（用户信息 / 权限）
\`\`\`

**使用 Zustand 示例**：

\`\`\`typescript
// store/user.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userInfo: UserInfo | null;
  // ...
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      userInfo: null,
      // ...
    }),
    { name: 'user-storage' }
  )
);
\`\`\`

---

### 4.13、plugins目录

\`\`\`text
plugins/
├── i18n.ts                # 国际化初始化
├── cache.ts               # 缓存策略
├── analytics.ts           # 数据埋点
└── logger.ts              # 日志系统
\`\`\`

**适用场景**：

| 插件         | 用途                   |
| ------------ | ---------------------- |
| i18n.ts      | 国际化初始化、语言切换 |
| cache.ts     | 请求缓存、离线存储     |
| analytics.ts | 用户行为埋点、数据上报 |
| logger.ts    | 日志收集、错误上报     |

---

### 4.14、utils目录

\`\`\`text
utils/
├── request.ts             # Axios 封装
├── storage.ts             # localStorage 封装
├── cookie.ts              # Cookie 操作
├── auth.ts                # 认证工具
└── format.ts              # 格式化工具
\`\`\`

**规范要求**：

| 规则                    | 说明             |
| ----------------------- | ---------------- |
| ❌ 禁止 utils.ts 大杂烩 | 反模式           |
| ✅ 单一职责文件         | 一个功能一个文件 |
| ✅ 纯函数优先           | 无副作用         |

---

### 4.15、pages目录

\`\`\`text
pages/
├── login/                      # 登录页面
├── transfer-station/           # 中转页面
├── dashboard/                  # 仪表盘
├── user-management/            # 用户管理
└── error/                      # 错误页面
\`\`\`

**规范要求**：

| 规则              | 说明                        |
| ----------------- | --------------------------- |
| ✅ 页面自治       | 每个页面包含完整的功能单元  |
| ✅ 私有组件不外露 | components 仅供当前页面使用 |
| ✅ 接口集中管理   | 使用 services.ts            |
| ✅ 状态就近原则   | 页面级状态使用 store.ts     |

---

### 4.16、styles目录

\`\`\`text
styles/
├── reset.scss             # 样式重置
├── variables.scss         # SCSS 变量
├── mixins.scss            # SCSS 混入
├── lee.scss               # 自定义样式
└── global.scss            # 全局样式入口
\`\`\`

**变量规范**：

\`\`\`scss
// variables.scss
$primary-color: #1890ff;
$spacing-md: 16px;
\`\`\`

---

### 4.17、layout目录

\`\`\`text
layout/
├── lee-basic-layout/           # 基础布局
├── lee-sidebar-layout/         # 侧边栏布局
├── lee-top-menu-layout/        # 顶部菜单布局
├── hooks/                      # 布局 Hooks
├── stores/                     # 布局状态
├── themes/                     # 布局主题
└── utils/                      # 布局工具
\`\`\`

**设计原则**：

| 原则                 | 说明                       |
| -------------------- | -------------------------- |
| ✅ Layout 只处理结构 | 不处理业务数据             |
| ✅ 支持多种布局模式  | basic / sidebar / top-menu |
| ✅ 内置主题切换能力  | 支持明暗主题               |
| ✅ 内置国际化支持    | 独立的 i18n 资源           |

#### 4.17.1、UUID工具

**文件位置**: \`src/layout/utils/uuid.ts\`

**说明**: 基于 \`uuid\` 包（v13.0.0）封装的 UUID 生成工具类，提供多版本 UUID 生成、验证和转换功能。

**核心特性**:
- ✅ 支持多种 UUID 版本（v1/v3/v4/v5/v6/v7）
- ✅ UUID 验证和版本检测
- ✅ UUID 格式转换（字符串 ↔ 字节数组）
- ✅ 版本间转换（v1 ↔ v6）
- ✅ 批量生成 UUID
- ✅ 预定义命名空间（DNS/URL/OID/X500）

**使用示例**:

\`\`\`typescript
import { UUID, UUIDNamespaces } from '@/layout/utils/uuid';

// 生成随机 UUID (v4)
const id = UUID.v4(); // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

// 生成基于时间戳的 UUID (v7) - 推荐用于数据库主键
const dbId = UUID.v7(); // '01695553-c90c-745a-b76f-770d7b3dcb6d'

// 验证 UUID
UUID.validate('invalid'); // false
UUID.validate('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b'); // true

// 检测 UUID 版本
UUID.version('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b'); // 4

// 生成基于命名空间的 UUID (v5)
const urlId = UUID.v5('https://example.com', UUIDNamespaces.URL);

// 批量生成 UUID
const ids = UUID.generateMultiple(10, 7); // 生成10个 v7 UUID

// 获取特殊 UUID
const nilId = UUID.NIL;  // '00000000-0000-0000-0000-000000000000'
const maxId = UUID.MAX;  // 'ffffffff-ffff-ffff-ffff-ffffffffffff'
\`\`\`

**版本选择指南**:

| UUID 版本 | 特点 | 适用场景 |
|----------|------|---------|
| **v4** | 随机生成 | 通用唯一标识符 |
| **v7** | 基于时间戳，可排序 | 数据库主键（推荐） |
| **v1** | 基于时间戳和 MAC 地址 | 需要时间排序的场景 |
| **v6** | v1 的重排序版本 | 时间排序优化 |
| **v3/v5** | 基于命名空间和哈希 | 确定性 UUID 生成 |

---

### 4.18、i18n目录

**目录位置**: \`src/i18n/\`

**说明**: 全局多语言配置文件与翻译资源。与 Layout 组件内部的 i18n 互补。

**目录结构**:
\`\`\`text
i18n/
├── index.ts               # i18n初始化配置
├── zh-CN/                 # 中文资源
└── en-US/                 # 英文资源
\`\`\`

### 4.19、types目录

**目录位置**: \`src/types/\`

**说明**: 全局 TypeScript 类型定义文件。

**目录结构**:
\`\`\`text
types/
├── index.ts               # 统一导出
├── route.ts               # 路由相关类型
└── user.ts                # 用户相关类型
\`\`\`

#### 类型定义示例

**路由类型** (\`types/route.ts\`):
\`\`\`typescript
import type { ComponentType } from "react";

// 路由 Meta 信息
export interface RouteMeta {
  title: string;              // 页面标题
  icon?: string;              // 图标
  requiresAuth?: boolean;     // 是否需要认证
  roles?: string[];           // 访问角色
  permissions?: string[];     // 访问权限
  hidden?: boolean;           // 是否在菜单中隐藏
  keepAlive?: boolean;        // 是否缓存页面
  order?: number;             // 排序
  external?: string;          // 外链
  target?: "_blank" | "_self"; // 目标
  i18n?: string;              // 国际化标识
}

// 路由项
export interface RouteItem {
  path: string;               // 路径
  component?: ComponentType | (() => Promise<{ default: ComponentType }>);
  children?: RouteItem[];     // 子路由
  redirect?: string;          // 重定向
  meta?: RouteMeta;           // Meta 信息
  name?: string;              // 路由名称
}

// 菜单项（用于侧边栏）
export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  external?: string;
  target?: "_blank" | "_self";
  hidden?: boolean;
  order?: number;
}

// 面包屑项
export interface BreadcrumbItem {
  title: string;
  path?: string;
}
\`\`\`

**用户类型** (\`types/user.ts\`):
\`\`\`typescript
// 用户信息
export interface User {
  id: string;                 // 用户ID
  username: string;           // 用户名
  email: string;              // 邮箱
  avatar?: string;            // 头像
  role: string;               // 角色
  roles?: string[];           // 角色列表
  permissions: string[];      // 权限列表
  createTime?: string;        // 创建时间
  updateTime?: string;        // 更新时间
}

// 用户列表查询参数
export interface UserListParams {
  page: number;               // 页码
  pageSize: number;           // 每页数量
  keyword?: string;           // 搜索关键词
  role?: string;              // 角色筛选
  status?: number;            // 状态筛选
}

// 用户列表响应
export interface UserListResponse {
  list: User[];               // 用户列表
  total: number;              // 总数
  page: number;               // 当前页
  pageSize: number;           // 每页数量
}

// 登录参数
export interface LoginParams {
  username: string;           // 用户名
  password: string;           // 密码
  remember?: boolean;         // 记住我
}

// 登录响应
export interface LoginResponse {
  token: string;              // 访问令牌
  refreshToken?: string;      // 刷新令牌
  userInfo: User;             // 用户信息
}
\`\`\`

**统一导出** (\`types/index.ts\`):
\`\`\`typescript
// 导出所有类型
export * from './route';
export * from './user';
\`\`\`

**使用示例**:
\`\`\`typescript
// 在组件中使用
import type { User, UserListParams } from '@/types/user';
import type { RouteItem, MenuItem } from '@/types/route';

// 在服务层使用
import type { UserListResponse } from '@/types';

export const getUserList = (params: UserListParams) => {
  return $get<UserListResponse>('/api/users', params);
};
\`\`\`

---

## 五、命名规范速查表

### 5.1、组件命名规范
**规范**: PascalCase (大驼峰)
**说明**: React 组件文件名和组件名统一使用大驼峰命名法。
**示例**: \`PageHeader\`, \`UserTable\`, \`LoginForm\`

### 5.2、文件命名规范
**规范**: kebab-case (短横线)
**说明**: 非组件文件(如工具、服务、钩子)使用短横线命名。
**示例**: \`user-service.ts\`, \`use-auth.ts\`, \`data-format.ts\`

### 5.3、文件夹命名规范
**规范**: kebab-case (短横线)
**说明**: 目录名称统一使用短横线命名，保持层级清晰。
**示例**: \`user-management/\`, \`components/\`, \`styles/\`

### 5.4、函数命名规范
**规范**: camelCase (小驼峰)
**说明**: 普通函数、某些 hooks 使用小驼峰命名。
**示例**: \`getUserList\`, \`handleSubmit\`, \`formatDate\`

### 5.5、接口命名规范
**规范**: PascalCase (大驼峰)
**说明**: 接口定义使用大驼峰，建议不加 I 前缀(React社区习惯)，或者统一加 I 前缀(团队约定)。本项目推荐直接使用名称。
**示例**: \`User\`, \`ApiResponse\`, \`RouteConfig\`

### 5.6、常量命名规范
**规范**: UPPER_SNAKE_CASE (全大写下划线)
**说明**: 全局常量、配置常量使用全大写。
**示例**: \`API_BASE_URL\`, \`MAX_PAGE_SIZE\`, \`DEFAULT_THEME\`

### 5.7、枚举命名规范
**规范**: PascalCase (大驼峰)
**说明**: 枚举类型和枚举值使用大驼峰。
**示例**: \`UserStatus\`, \`OrderType\`, \`RoleEnum\`

### 5.8、类型命名规范
**规范**: PascalCase (大驼峰)
**说明**: Type 类型定义使用大驼峰。
**示例**: \`UserInfo\`, \`LoginParams\`, \`ThemeType\`

### 5.9、变量命名规范
**规范**: camelCase (小驼峰)
**说明**: 普通变量使用小驼峰。
**示例**: \`userInfo\`, \`isLoading\`, \`tableData\`

### 5.10、css样式命名规范
**规范**: kebab-case / BEM
**说明**: CSS 类名使用短横线，复杂组件推荐 BEM (Block__Element--Modifier)。
**示例**: \`page-header\`, \`user-table\`, \`card__header--active\`

### 5.11、assets资源命名规范
**规范**: kebab-case (短横线)
**说明**: 图片、图标等资源文件使用短横线命名。
**示例**: \`logo.png\`, \`user-avatar-default.png\`, \`icon-home.svg\`

---

## 六、项目配置文件

### 6.1、npm配置文件
**文件**: \`package.json\`
**说明**: 定义项目依赖、脚本命令、元数据等。
**核心字段**:
- \`scripts\`: 定义启动、构建、测试等命令
- \`dependencies\`: 生产环境依赖
- \`devDependencies\`: 开发环境依赖

### 6.2、vite配置文件
**文件**: \`vite.config.ts\`
**说明**: Vite 构建工具的核心配置，包含插件、别名、代理、构建选项等。
**核心配置**:
\`\`\`typescript
export default defineConfig({
  plugins: [react()],
  resolve: { 
    alias: { 
      '@': path.resolve(__dirname, './src'),
      '@AI': path.resolve(__dirname, './src_ai'),  // AI 代码目录别名
      '@ai': path.resolve(__dirname, './src_ai')   // 小写别名（兼容）
    } 
  },
  server: { port: 4200, proxy: { '/api': '...' } }
});
\`\`\`

### 6.3、ts配置文件
**文件**: \`tsconfig.json\` / \`tsconfig.app.json\` / \`tsconfig.node.json\`
**说明**: TypeScript 编译配置。
- \`tsconfig.json\`: 根配置，一般引用 app 和 node 配置
- \`tsconfig.app.json\`: 前端代码的 TS 配置
- \`tsconfig.node.json\`: Vite 配置文件(运行在 Node 环境)的 TS 配置

### 6.4、eslint配置文件
**文件**: \`eslint.config.js\`
**说明**: 代码检查规则配置，本项目使用 Flat Config 格式。
**核心插件**: \`@eslint/js\`, \`typescript-eslint\`, \`eslint-plugin-react-hooks\`

### 6.5、prettier配置文件
**文件**: \`.prettierrc\`
**说明**: 代码格式化配置，保证团队代码风格统一。
**核心规则**:
- \`semi\`: true (使用分号)
- \`singleQuote\`: false (使用双引号)
- \`tabWidth\`: 2 (缩进2空格)

**文件**: \`.prettierignore\`
**说明**: 配置不需要 Prettier 格式化的文件或目录。
**常见忽略**:
- \`node_modules\`
- \`dist\`
- \`pnpm-lock.yaml\`


### 6.6、vite环境变量配置文件
**文件**: \`.env.development\`
**说明**: \`npm run dev\` 时加载的环境变量。
**内容示例**:
\`\`\`properties
VITE_APP_ENV=development
VITE_APP_API_URL=/api
\`\`\`

**文件**: \`.env.production\`
**说明**: \`npm run build\` 时加载的环境变量。
**内容示例**:
\`\`\`properties
VITE_APP_ENV=production
VITE_APP_API_URL=https://api.example.com
\`\`\`

**文件**: \`.env.preview\`
**说明**: \`npm run preview\` 预览模式下的环境变量。
**内容示例**:
\`\`\`properties
VITE_APP_ENV=preview
VITE_APP_API_URL=https://api-preview.example.com
\`\`\`

**文件**: \`.env.mock\`
**说明**: 模拟数据模式下的环境变量。
**内容示例**:
\`\`\`properties
VITE_APP_ENV=mock
VITE_APP_USE_MOCK=true
\`\`\`

#### 环境变量加载优先级

Vite 按以下顺序加载环境变量文件（**后加载的会覆盖先加载的**）：

| 优先级 | 文件名 | 说明 | Git提交 |
|--------|--------|------|---------|
| 1（最低） | \`.env\` | 所有环境都会加载的基础配置 | ✅ 提交 |
| 2 | \`.env.local\` | 本地环境覆盖配置（所有环境） | ❌ 不提交 |
| 3 | \`.env.[mode]\` | 特定模式的配置（如\`.env.development\`） | ✅ 提交 |
| 4（最高） | \`.env.[mode].local\` | 特定模式的本地覆盖配置 | ❌ 不提交 |

**加载示例**：
\`\`\`bash
# 执行 npm run dev 时，Vite 会按顺序加载：
1. .env                    # 基础配置
2. .env.local              # 本地覆盖（如果存在）
3. .env.development        # 开发环境配置
4. .env.development.local  # 开发环境本地覆盖（如果存在）
\`\`\`

#### 环境切换方法

| 命令 | 模式 | 加载的环境文件 | 用途 |
|------|------|----------------|------|
| \`npm run dev\` | \`development\` | \`.env.development\` | 本地开发 |
| \`npm run build\` | \`production\` | \`.env.production\` | 生产构建 |
| \`npm run preview\` | \`preview\` | \`.env.preview\` | 预览构建结果 |
| \`npm run mock\` | \`mock\` | \`.env.mock\` | Mock数据开发 |

**自定义模式**：
\`\`\`bash
# 使用自定义模式
vite --mode staging  # 会加载 .env.staging
\`\`\`

#### 环境变量使用规范

**命名规范**：
- ✅ 必须以 \`VITE_\` 开头才能在客户端代码中访问
- ✅ 使用大写字母和下划线：\`VITE_APP_API_URL\`
- ❌ 不要在环境变量中存储敏感信息（如密钥、密码）

**使用示例**：
\`\`\`typescript
// 在代码中访问环境变量
const apiUrl = import.meta.env.VITE_APP_API_URL;
const env = import.meta.env.VITE_APP_ENV;
const mode = import.meta.env.MODE;  // Vite 内置变量

// 类型定义（推荐在 vite-env.d.ts 中定义）
interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_USE_MOCK?: string;
}
\`\`\`

**最佳实践**：
1. ✅ 将 \`.env.*.local\` 添加到 \`.gitignore\`
2. ✅ 在 \`.env\` 中提供默认值和示例
3. ✅ 在项目文档中说明所需的环境变量
4. ❌ 不要在环境变量中存储敏感信息
5. ✅ 使用 \`.env.example\` 作为模板文件提交到仓库


### 6.7、tailwind配置文件
**文件**: \`tailwind.config.js\`
**说明**: TailwindCSS 的主题配置、插件配置、内容扫描路径配置。
**核心配置**:
- \`content\`: 指定需要扫描 class 的文件路径
- \`theme\`: 自定义颜色、字体、间距等

### 6.8、postcss配置文件
**文件**: \`postcss.config.js\`
**说明**: CSS 后处理器配置，主要用于加载 TailwindCSS 和 Autoprefixer。
**配置内容**:
\`\`\`javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
\`\`\`

---

## 七、项目国际化设计

### 7.1、国际化系统设计概述

本项目采用 **i18next** + **react-i18next** + **i18next-browser-languagedetector** 构建完整的国际化方案，支持**Layout层**(框架级)和**Business层**(业务级)的双层国际化架构。

**核心特性**:
- ✅ 自动语言检测(浏览器/缓存)
- ✅ 动态加载语言包(分包加载)
- ✅ 类型安全的翻译Key
- ✅ 命名空间(Namespace)隔离(common/layout/pages)
- ✅ 独立的状态管理(i18nStore)

**文件位置**:
- 配置入口: \`src/i18n/index.ts\`
- 语言资源: \`src/i18n/locales/\`

### 7.2、layout国际化控制

负责系统框架级别的多语言支持，包括菜单、面包屑、顶部导航、系统提示等。

**资源路径**: \`src/layout/i18n/\`

**关键实现**:
1. **状态管理**: 通过 \`i18nStore\` 管理当前语言状态，并持久化到LocalStorage。
2. **组件联动**: 语言切换时，自动触发布局组件(Menu, Header)的重渲染。
3. **Ant Design集成**: 自动切换组件库(AntD)的语言包(LocaleProvider)。

**代码示例**:
\`\`\`typescript
// src/layout/stores/i18nStore.ts
export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'zh-CN',
      setLanguage: (lang) => {
        i18n.changeLanguage(lang); // 触发i18next切换
        set({ language: lang });
      },
    }),
    { name: 'i18n-storage' }
  )
);
\`\`\`

### 7.3、业务国际化控制

负责具体业务页面的多语言支持，如仪表盘、用户管理、登录页等。

**资源组织**:
建议按页面或模块划分 namespace，避免单一文件过大。

\`\`\`text
src/i18n/
├── index.ts
├── zh-CN/
│   ├── common.ts      # 通用词条(按钮/提示)
│   ├── login.ts       # 登录页
│   └── dashboard.ts   # 仪表盘
└── en-US/
    ├── common.ts
    ├── login.ts
    └── dashboard.ts
\`\`\`

**使用示例**:
\`\`\`typescript
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation('login'); // 指定 namespace

  return (
    <Form>
      <Form.Item label={t('username')}>...</Form.Item>
      <Button>{t('submit', { ns: 'common' })}</Button> {/* 跨 namespace 调用 */}
    </Form>
  );
};
\`\`\`

---

## 八、项目layout布局设计

### 8.1、布局系统概述

本项目提供三种企业级布局方案(**lee-basic-layout** / **lee-sidebar-layout** / **lee-top-menu-layout**),支持主题切换和国际化。

**文件位置**: \`src/layout/\`

**布局特性**:
- ✅ 三种可切换布局
- ✅ 主题切换(明暗主题+可扩展更多主题色)
- ✅ 国际化支持(中英文+可扩展更多语言)
- ✅ 响应式设计
- ✅ 菜单权限控制
- ✅ 面包屑导航

### 8.2、三种布局方案

| 布局类型 | 说明 | 适用场景 | 文件路径 |
| -------- | ---- | -------- | -------- |
| **lee-basic-layout** | 左侧菜单+顶部导航 | 后台管理系统(推荐) | \`src/layout/lee-basic-layout/\` |
| **lee-sidebar-layout** | 纯侧边栏布局 | 内容管理系统 | \`src/layout/lee-sidebar-layout/\` |
| **lee-top-menu-layout** | 顶部菜单布局 | 门户网站 | \`src/layout/lee-top-menu-layout/\` |

### 8.3、项目主题色切换设计

#### 8.3.1 主题系统架构

**状态管理**: \`src/layout/stores/themeStore.ts\`

**主题配置**: \`src/layout/themes/\`

**支持的主题**:
- \`light\` - 亮色主题(默认)
- \`dark\` - 暗色主题
- 可扩展更多自定义主题色

#### 8.3.2 主题切换使用

\`\`\`typescript
import { useTheme } from '@/layout/hooks/use-theme';

function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 暗色' : '☀️ 亮色'}
    </Button>
  );
}
\`\`\`

### 8.4、项目国际化设计

#### 8.4.1 国际化架构

**状态管理**: \`src/layout/stores/i18nStore.ts\`

**语言资源**:
- \`src/layout/i18n/zh-CN/\` - 中文
- \`src/layout/i18n/en-US/\` - 英文
- 可扩展更多语言包

#### 8.4.2 国际化使用

\`\`\`typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();
  
  // 使用翻译
  return <div>{t('common.welcome')}</div>;
  
  // 切换语言
  const changeLang = () => i18n.changeLanguage('en-US');
}
\`\`\`

---

## 九、项目权限控制设计

### 9.1、权限系统概述

本项目实现**三级权限控制体系**：页面级权限（路由过滤）+ 按钮级权限（组件权限）+ API接口级权限（请求拦截）。

**核心文件**: \`src/layout/utils/leePermission.ts\`

**权限类型**:

| 权限级别 | 权限标识格式 | 实现方式 | 适用场景 |
|---------|-------------|---------|---------|
| **页面级** | \`page:模块名\` | 路由过滤 | 控制用户可访问的页面 |
| **按钮级** | \`btn:模块名:操作名\` | 组件封装 | 控制按钮/区块的显示 |
| **API接口级** | \`/接口路径\` | 装饰器/拦截器 | 控制API接口的调用 |

### 9.2、页面级权限控制

#### 9.2.1 设计思想

采用**路由过滤**机制，在路由初始化时根据用户权限过滤路由树，只保留有权限的路由。

**核心函数**: \`filterRoutesByPerm(staticWebRoutes, asyncServerRoutes?)\`

**权限列表**:
- \`staticRoutesPermissionList\` - 静态路由权限（登录页、错误页等公开页面）
- \`asyncRoutesPermissionList\` - 动态路由权限（业务页面，可由后端返回）

#### 9.2.2 权限标识符命名规范

\`\`\`typescript
// 格式: page:模块名 或 page:模块名:子模块名
"page:dashboard"           // 仪表盘
"page:profile"             // 个人中心
"page:system-management"   // 系统管理
"page:system:user"         // 系统管理-用户管理
"page:system:role"         // 系统管理-角色管理
"page:examples:ajax"       // 示例-AJAX示例
\`\`\`

#### 9.2.3 路由配置示例

\`\`\`typescript
// src/router/routes.ts
const routes: RouteItem[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard'),
    meta: {
      title: '仪表盘',
      pagePermission: 'page:dashboard', // 页面权限标识
    },
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      pagePermission: 'page:system-management',
    },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/pages/system-management/user-management'),
        meta: {
          title: '用户管理',
          pagePermission: 'page:system:user',
        },
      },
    ],
  },
];
\`\`\`

#### 9.2.4 路由过滤使用

\`\`\`typescript
// src/router/routes.ts
import { filterRoutesByPerm } from '@/layout/utils/leePermission';

// 方式1：后台权限标识控制模式（前端存储全部路由，后端返回权限标识）
const filteredRoutes = filterRoutesByPerm(staticWebRoutes);

// 方式2：后台动态路由控制模式（后端返回路由配置）
const asyncServerRoutes = await fetchRoutesFromServer();
const filteredRoutes = filterRoutesByPerm(staticWebRoutes, asyncServerRoutes);
\`\`\`

#### 9.2.5 权限验证函数

\`\`\`typescript
import { hasRoutePermission } from '@/layout/utils/leePermission';

// 检查是否有访问仪表盘的权限
if (hasRoutePermission('page:dashboard')) {
  // 显示仪表盘菜单
}

// 检查是否有访问用户管理的权限
if (hasRoutePermission('page:system:user')) {
  // 允许访问
}
\`\`\`

### 9.3、按钮级权限控制

#### 9.3.1 设计思想

采用**组件封装**方式，提供 \`LeeButton\` 和 \`LeeAccess\` 两个组件，内部自动进行权限检查。

**核心组件**:
- \`LeeButton\` - 按钮级权限控制组件
- \`LeeAccess\` - 区块级权限控制组件

**权限验证函数**:
- \`hasBtnPermission(permission)\` - 检查单个权限
- \`hasAnyBtnPermission(permissions)\` - 检查是否拥有任意一个权限
- \`hasAllBtnPermission(permissions)\` - 检查是否拥有所有权限

#### 9.3.2 权限标识符命名规范

\`\`\`typescript
// 格式: btn:模块名:操作名
"btn:login:login"           // 登录按钮
"btn:login:logout"          // 登出按钮
"btn:profile:getUserInfo"   // 获取用户信息
"btn:profile:editUserInfo"  // 编辑用户信息
"btn:user:create"           // 用户管理-新增
"btn:user:delete"           // 用户管理-删除
\`\`\`

#### 9.3.3 按钮级权限控制

**组件位置**: \`src/layout/components/Lee-Button/index.tsx\`

**使用示例**:
\`\`\`typescript
import LeeButton from '@/layout/components/Lee-Button';

function UserManagement() {
  return (
    <div>
      {/* 新增按钮 - 需要 btn:user:create 权限 */}
      <LeeButton 
        permissionCode="btn:user:create"
        type="primary"
        onClick={handleCreate}
      >
        新增用户
      </LeeButton>

      {/* 删除按钮 - 需要 btn:user:delete 权限 */}
      <LeeButton 
        permissionCode="btn:user:delete"
        danger
        onClick={handleDelete}
      >
        删除
      </LeeButton>
    </div>
  );
}
\`\`\`

#### 9.3.4 区块级权限控制

**组件位置**: \`src/layout/components/Lee-Access/index.tsx\`

**使用示例**:

**1. 单个权限控制**:
\`\`\`typescript
import LeeAccess from '@/layout/components/Lee-Access';

function UserProfile() {
  return (
    <div>
      {/* 只有拥有 btn:profile:editUserInfo 权限才显示编辑区块 */}
      <LeeAccess perm="btn:profile:editUserInfo">
        <div className="edit-section">
          <h3>编辑个人信息</h3>
          <Form>...</Form>
        </div>
      </LeeAccess>

      {/* 无权限时显示提示信息 */}
      <LeeAccess 
        perm="btn:profile:viewSensitiveInfo"
        fallback={<div>您没有权限查看敏感信息</div>}
      >
        <div className="sensitive-info">
          <p>身份证号：***</p>
        </div>
      </LeeAccess>
    </div>
  );
}
\`\`\`

**2. 多个权限控制（任意一个）**:
\`\`\`typescript
function Dashboard() {
  return (
    <div>
      {/* 拥有管理员或超级管理员任意一个权限即可查看 */}
      <LeeAccess 
        perm={['btn:admin:view', 'btn:superadmin:view']}
        type="any"
      >
        <div className="admin-panel">
          <h3>管理员面板</h3>
          <p>敏感数据...</p>
        </div>
      </LeeAccess>
    </div>
  );
}
\`\`\`

**3. 多个权限控制（全部拥有）**:
\`\`\`typescript
function FinancialReport() {
  return (
    <div>
      {/* 必须同时拥有查看和导出权限才能看到财务报表 */}
      <LeeAccess 
        perm={['btn:finance:view', 'btn:finance:export']}
        type="all"
        fallback={<div>权限不足，无法查看财务报表</div>}
      >
        <div className="financial-report">
          <h3>财务报表</h3>
          <Table dataSource={data} />
          <Button onClick={handleExport}>导出报表</Button>
        </div>
      </LeeAccess>
    </div>
  );
}
\`\`\`

### 9.4、API接口级权限控制

#### 9.4.1 设计思想

提供**两种实现方式**：装饰器方式（Service层）和拦截器方式（全局统一）。

**实现方式对比**:

| 方式 | 实现位置 | 优点 | 缺点 | 适用场景 |
|-----|---------|------|------|---------|
| **装饰器** | Service类方法 | 代码清晰，精细控制 | 需要在每个方法上添加 | Service层方法 |
| **拦截器** | 请求拦截器 | 全局统一，无需修改业务代码 | 所有接口都会检查 | 全局接口控制 |

**白名单机制**: \`apiWhiteList\` 中的接口跳过权限验证（如登录、注册等公开接口）

#### 9.4.2 权限标识符命名规范

\`\`\`typescript
// 格式: 直接使用接口路径
"/login"              // 登录接口
"/logout"             // 登出接口
"/getUserInfo"        // 获取用户信息
"/user/registerUser"  // 注册用户
"/validateToken"      // 验证Token
\`\`\`

#### 9.4.3 装饰器方式（推荐用于Service层）

**使用示例**:
\`\`\`typescript
// src/services/login-service/index.ts
import { LeeApiPermission } from '@/layout/utils/leePermission';
import { LeeLoggerMethod, LOG_LEVEL, OPERATION_TYPE } from '@/layout/utils/leeLogger';

export class LoginService {
  // ⚠️ 注意：@LeeApiPermission 必须在最外层（第一个装饰器）
  @LeeApiPermission('/login')
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户认证',
    operation: OPERATION_TYPE.LOGIN,
  })
  async login(data: LoginInfo) {
    return await $post('/login', data);
  }

  @LeeApiPermission('/logout')
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户认证',
    operation: OPERATION_TYPE.LOGOUT,
  })
  async logout() {
    return await $post('/logout');
  }
}
\`\`\`

**装饰器特性**:
- ✅ 在方法调用前检查权限
- ✅ 无权限则抛出错误，阻止方法执行
- ✅ 自动检查白名单
- ✅ 错误信息包含方法名和权限标识

#### 9.4.4 拦截器方式（全局统一控制）

**实现位置**: \`src/layout/utils/request.ts\`

**拦截器代码**:
\`\`\`typescript
// 请求拦截器
this.instance.interceptors.request.use((config) => {
  // 校验接口级权限
  if (!hasApiPermission(config.url as string)) {
    const error: any = {
      message: "您没有权限访问此接口",
      code: "PERMISSION_DENIED",
      permission: config.url,
      skipErrorHandler: true,
    };
    return Promise.reject(error);
  }
  
  // 继续执行请求...
  return config;
});
\`\`\`

#### 9.4.5 权限配置

\`\`\`typescript
// src/layout/utils/leePermission.ts

// API接口权限列表
const apiPermissionList: string[] = [
  "/login",
  "/logout",
  "/user/registerUser",
  "/getUserInfo",
  "/validateToken",
];

// API接口白名单（跳过权限验证）
const apiWhiteList: string[] = [
  "/login",  // 登录接口在白名单中，所有人都可以访问
  "/logout",
  "/user/registerUser",
  "/getUserInfo",
  "/validateToken",
];
\`\`\`

#### 9.4.6 错误处理

\`\`\`typescript
// 在业务代码中捕获权限错误
try {
  const loginService = new LoginService();
  await loginService.login({ username: 'admin', password: '123456' });
} catch (error: any) {
  if (error.code === 'PERMISSION_DENIED') {
    // 权限错误
    message.error(error.message);
  } else {
    // 其他错误
    message.error('登录失败');
  }
}
\`\`\`

### 9.5、权限系统最佳实践

#### 9.5.1 权限标识符设计原则

1. **统一命名规范**: 严格遵循 \`类型:模块:操作\` 的格式
2. **语义化**: 权限标识符应清晰表达其含义
3. **层级化**: 使用冒号分隔层级，便于管理
4. **避免重复**: API接口权限与按钮权限可能重合，需谨慎使用

#### 9.5.2 权限控制选择指南

| 场景 | 推荐方式 | 原因 |
|------|---------|------|
| 控制页面访问 | 页面级权限 | 路由级别控制，性能最优 |
| 控制按钮显示 | 按钮级权限 | 组件级别控制，灵活方便 |
| 控制区块显示 | 区块级权限 | 支持多权限组合判断 |
| 控制API调用 | API接口级权限 | 双重保障，安全性高 |

#### 9.5.3 注意事项

1. **装饰器顺序**: \`@LeeApiPermission\` 必须在最外层（第一个装饰器）
2. **权限重合**: API接口权限会与按钮级权限作用重合，需根据实际情况谨慎使用
3. **白名单管理**: 公开接口（登录、注册）应加入白名单
4. **权限存储**: 用户权限存储在 Zustand 的 \`userStore\` 中
5. **性能考虑**: 拦截器方式会检查所有请求，建议使用白名单优化

---


## 十、项目ajax通信service设计

### 10.1、HTTP通信架构概述

本项目采用**Axios + SSE + WebSocket**三种通信方式,满足不同业务场景的需求。

**核心文件**:
- Axios封装: \`src/layout/utils/request.ts\`
- SSE客户端: \`src/layout/utils/sse.ts\`
- SSE Hook: \`src/utils/use-sse.tsx\`
- WebSocket: \`src/layout/utils/websocket.ts\`

### 10.2、通信方式对比

| 通信方式 | 特点 | 适用场景 | 实现文件 |
| -------- | ---- | -------- | -------- |
| **Axios** | 请求-响应模式,支持拦截器、取消请求 | 常规CRUD操作、文件上传下载 | \`layout/utils/request.ts\` |
| **SSE** | 服务器单向推送,自动重连 | 实时通知、日志流式输出、AI流式响应 | \`layout/utils/sse.ts\` / \`utils/use-sse.tsx\` |
| **WebSocket** | 双向实时通信,低延迟 | 即时聊天、协同编辑、实时监控 | \`layout/utils/websocket.ts\` |

### 10.3、Axios HTTP客户端

#### 10.3.1 核心特性

- ✅ 统一的请求/响应拦截器
- ✅ 自动添加Authorization Token
- ✅ 全局错误处理(401/403/404/500等)
- ✅ NProgress加载进度条
- ✅ 支持文件上传/下载

#### 10.3.2 使用示例

\`\`\`typescript
// services/user/index.ts
import { $get, $post, $put, $delete } from '@/layout/utils/request';

// GET请求
export const getUserList = (params: UserListParams) => {
  return $get<UserListResponse>('/api/users', params);
};

// POST请求
export const createUser = (data: CreateUserDto) => {
  return $post<User>('/api/users', data);
};

// 文件上传
import { $upload } from '@/layout/utils/request';
export const uploadAvatar = (file: File) => {
  return $upload<{ url: string }>('/api/upload/avatar', file);
};
\`\`\`

#### 10.3.3 错误处理机制

- **401 Unauthorized**: 自动清除缓存并跳转登录页
- **403 Forbidden**: 提示无权限并跳转403页面
- **404/500/502/503/504**: 显示错误信息并跳转对应错误页

### 10.4、SSE流式通信

#### 10.4.1 核心特性

- ✅ 自动重连机制(可配置重连次数和间隔)
- ✅ 支持GET/POST请求
- ✅ 事件类型监听(自定义事件)
- ✅ React Hook封装,状态响应式
- ✅ 消息历史记录

#### 10.4.2 使用示例

\`\`\`typescript
// 在React组件中使用SSE Hook
import { useSSE } from '@/utils/use-sse';

function ChatComponent() {
  const {
    state,
    messages,
    connect,
    disconnect,
    addEventListener
  } = useSSE('/api/chat/stream', {
    autoConnect: true,
    maxEvents: 100,
    formatMessage: (data) => JSON.parse(data),
    eventListeners: {
      onOpen: (event) => console.log('SSE连接建立'),
      onMessage: (data, event) => console.log('收到消息:', data),
      onError: (event) => console.error('SSE错误:', event.error),
      onClose: (event) => console.log('SSE连接关闭')
    }
  });

  // 监听自定义事件
  useEffect(() => {
    addEventListener('ai-response', (data) => {
      console.log('AI流式响应:', data);
    });
  }, [addEventListener]);

  return (
    <div>
      <div>连接状态: {state.connectionStatus}</div>
      <div>消息列表: {messages.map(m => m.data).join('\\n')}</div>
    </div>
  );
}
\`\`\`

#### 10.4.3 配置选项

\`\`\`typescript
interface UseSSEOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  maxReconnectAttempts?: number;  // 最大重连次数
  reconnectInterval?: number;     // 重连间隔(ms)
  autoConnect?: boolean;          // 是否自动连接
  maxEvents?: number;             // 最大事件历史记录数
  formatMessage?: (data: string) => any;  // 消息格式化器
}
\`\`\`

### 10.5、WebSocket双向通信

#### 10.5.1 核心特性

- ✅ 心跳检测机制
- ✅ 断线自动重连
- ✅ 消息队列(断线期间消息缓存)
- ✅ 二进制数据支持

#### 10.5.2 使用示例

\`\`\`typescript
// 创建WebSocket实例
import { WebSocketClient } from '@/layout/utils/websocket';

const ws = new WebSocketClient('ws://localhost:8080/ws', {
  onOpen: (event) => console.log('WebSocket连接建立'),
  onMessage: (event) => console.log('收到消息:', event.data),
  onError: (event) => console.error('WebSocket错误:', event),
  onClose: (event) => console.log('WebSocket连接关闭'),
  heartbeatInterval: 30000,    // 心跳间隔30秒
  reconnectAttempts: 5,        // 最大重连5次
  reconnectInterval: 3000      // 重连间隔3秒
});

// 发送消息
ws.send({ type: 'chat', message: 'Hello' });

// 关闭连接
ws.close();
\`\`\`

### 10.6、通信方式选择指南

| 需求 | 推荐方案 |
| ---- | -------- |
| 常规CRUD、表单提交 | Axios HTTP |
| AI流式输出、实时日志、服务器推送通知 | SSE |
| 即时聊天、协同编辑、游戏、实时监控 | WebSocket |

### 10.7、Services层组织规范

#### 10.7.1 目录结构

\`\`\`
src/services/
├── index.ts                # 统一导出所有服务
├── dashboard/              # 仪表盘服务
│   └── index.ts
├── login-service/          # 登录服务
│   └── index.ts
├── menu/                   # 菜单服务
│   └── index.ts
├── role/                   # 角色服务
│   └── index.ts
└── user/                   # 用户服务
    └── index.ts
\`\`\`

#### 10.7.2 服务层规范

| 规则 | 说明 |
| ---- | ---- |
| ❌ 不直接在页面写请求 | 请求统一封装 |
| ✅ 调用链路 | 页面 → services → utils/request |
| ✅ 按业务模块拆分 | 一个模块一个目录 |
| ✅ 返回类型定义 | 使用TypeScript泛型 |

#### 10.7.3 服务层示例

\`\`\`typescript
// services/user/index.ts
import { $get, $post, $put, $delete } from '@/layout/utils/request';
import type { User, UserListParams, UserListResponse } from '@/types/user';

export const getUserList = (params: UserListParams) => {
  return $get<UserListResponse>('/api/users', params);
};

export const getUserById = (id: string) => {
  return $get<User>(\`/api/users/\${id}\`);
};

export const createUser = (data: Partial<User>) => {
  return $post<User>('/api/users', data);
};

export const updateUser = (id: string, data: Partial<User>) => {
  return $put<User>(\`/api/users/\${id}\`, data);
};

export const deleteUser = (id: string) => {
  return $delete(\`/api/users/\${id}\`);
};
\`\`\`

---

## 十一、项目store状态管理库设计

### 11.1、状态管理概述

本项目使用**Zustand**作为状态管理库,简单、轻量、类型安全。

**Store文件位置**: \`src/store/\`

### 11.2、Store架构

\`\`\`
src/store/                      # 全局业务状态
├── index.ts                    # 统一导出
├── app.ts                      # 应用全局状态(主题/语言/布局)
└── user.ts                     # 用户状态(用户信息/权限/token)

src/layout/stores/              # 布局系统状态
├── i18nStore.ts                # 国际化状态
├── layoutStore.ts              # 布局状态
├── menuStore.ts                # 菜单状态(菜单展开/选中/路由数据)
├── router-store.ts             # 路由状态(动态路由配置)
└── themeStore.ts               # 主题状态
\`\`\`

### 11.3、核心Store说明

#### 11.3.1 App Store

**文件**: \`src/store/app.ts\`

**管理状态**:
- 主题模式(theme)
- 语言设置(locale)
- 布局类型(layout)
- 侧边栏折叠状态(sidebarCollapsed)

**使用示例**:
\`\`\`typescript
import { useAppStore } from '@/store';

const { theme, setTheme } = useAppStore();
\`\`\`

#### 11.3.2 User Store

**文件**: \`src/store/user.ts\`

**管理状态**:
- 用户信息(userInfo)
- 用户权限(permissions)
- 访问令牌(token)
- 刷新令牌(refreshToken)

**使用示例**:
\`\`\`typescript
import { useUserStore } from '@/store';

const { userInfo, setUserInfo, clearUser } = useUserStore();
\`\`\`

#### 11.3.3 Router Store (布局系统)

**文件**: \`src/layout/stores/router-store.ts\`

**核心功能**: 管理应用的动态路由配置，支持后端控制路由和权限过滤。

**管理状态**:
- \`routes\` - 当前路由配置数组
- \`setRoutes\` - 更新路由配置（自动触发菜单更新）
- \`getRoutes\` - 获取当前路由配置
- \`resetRoutes\` - 重置路由配置

**使用示例**:
\`\`\`typescript
import { useRouterStore } from '@/layout/stores/router-store';
import { filterRoutesByPerm } from '@/layout/utils/leePermission';

// 在 SSO Loading 页面初始化路由
function initRoutes(serverRoutes?: RouteItem[]) {
  let allRoutes: RouteItem[];
  
  if (serverRoutes && serverRoutes.length > 0) {
    // 后端动态路由模式
    allRoutes = filterRoutesByPerm(staticRoutes, serverRoutes);
  } else {
    // 前端静态路由模式
    allRoutes = filterRoutesByPerm(routes);
  }
  
  // 更新路由配置（会自动更新菜单）
  useRouterStore.getState().setRoutes(allRoutes);
}

// 在组件中使用
function MyComponent() {
  const { routes, getRoutes } = useRouterStore();
  
  // 获取当前路由配置
  const currentRoutes = getRoutes();
  
  return <div>当前路由数量: {routes.length}</div>;
}
\`\`\`

**特性**:
- ✅ 支持动态路由更新
- ✅ 自动触发菜单数据更新
- ✅ 集成权限过滤
- ✅ 支持路由重置

#### 11.3.4 Menu Store (布局系统)

**文件**: \`src/layout/stores/menu-store.ts\`

**核心功能**: 管理菜单的展开/选中状态和菜单数据，支持持久化存储。

**管理状态**:
- \`openKeys\` - 菜单展开的 key 数组
- \`selectedKeys\` - 菜单选中的 key 数组
- \`routesMenu\` - 菜单路由数据（用于菜单组件渲染）
- \`setOpenKeys\` - 设置展开状态
- \`setSelectedKeys\` - 设置选中状态（自动记录日志）
- \`resetMenuState\` - 重置菜单状态
- \`setRoutesMenu\` - 设置菜单路由数据
- \`getRoutesMenu\` - 获取菜单路由数据

**使用示例**:
\`\`\`typescript
import { useMenuStore } from '@/layout/stores/menu-store';

function MenuComponent() {
  const { 
    openKeys, 
    selectedKeys, 
    setOpenKeys, 
    setSelectedKeys 
  } = useMenuStore();
  
  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={setOpenKeys}
      onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
    >
      {/* 菜单项 */}
    </Menu>
  );
}
\`\`\`

**特性**:
- ✅ 持久化存储（localStorage）
- ✅ 自动日志记录（记录用户菜单操作）
- ✅ 与 router-store 联动（路由更新时自动更新菜单数据）
- ✅ 支持菜单状态重置

**数据流**:
\`\`\`
用户登录 → SSO Loading 初始化路由
  ↓
router-store.setRoutes(filteredRoutes)
  ↓
自动调用 menu-store.setRoutesMenu(filteredRoutes)
  ↓
菜单组件使用 routesMenu 渲染菜单
\`\`\`

### 11.4、Zustand最佳实践

\`\`\`typescript
// ✅ 推荐: 按状态分片,避免单一大Store
const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
}));

// ✅ 推荐: 使用selector减少重渲染
const theme = useAppStore((state) => state.theme);

// ❌ 不推荐: 直接使用整个store
const store = useAppStore();

// ✅ 推荐: 在组件外部调用 store 方法
useRouterStore.getState().setRoutes(newRoutes);

// ✅ 推荐: 使用 persist 中间件持久化状态
const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      openKeys: [],
      setOpenKeys: (keys) => set({ openKeys: keys }),
    }),
    {
      name: 'layout-menu-storage',
      partialize: (state) => ({
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys,
      }),
    }
  )
);
\`\`\`

---

## 十二、项目日志架构设计

### 12.1、日志系统概述

**LeeLogger企业级日志系统** - 完整的日志记录、管理和分析能力。

**文件位置**: \`src/layout/utils/leeLogger.ts\`

**核心特色**:
- ✅ 多级别日志(DEBUG/INFO/WARN/ERROR/FATAL)
- ✅ 结构化数据(JSON格式)
- ✅ 自动收集上下文(用户/路由/时间戳/IP/计算机信息)
- ✅ 持久化存储(SessionStorage，最大1000条)
- ✅ 装饰器支持(方法级日志自动记录)
- ✅ 日志导出(JSON/CSV/TXT)
- ✅ 自动IP获取(公网IP + 局域网IP)
- ✅ 路由-模块映射(自动推断所在模块)
- ✅ 日志筛选和查询

### 12.2、日志系统初始化

**初始化时机**: 在路由组件 \`LeeRouterV3\` 中自动初始化

**初始化配置**:

\`\`\`typescript
import { LeeLogger } from '@/layout/utils/leeLogger';
import routes from '@/router/routes';
import { useUserStore } from '@/store/user';

// 在应用启动时初始化
LeeLogger.init({
  // 路由配置数组，用于构建路由-模块映射表
  routes: routes,
  
  // 日志级别（默认：DEBUG）
  level: LOG_LEVEL.INFO,
  
  // 是否启用控制台输出（默认：true）
  consoleEnabled: import.meta.env.MODE !== 'production',
  
  // 当前用户信息（可选，未提供时使用默认用户"神秘小李/9527"）
  currentUser: useUserStore.getState().userInfo
    ? {
        userName: useUserStore.getState().userInfo.loginName,
        userId: useUserStore.getState().userInfo.id
      }
    : undefined,
  
  // 是否自动获取IP（默认：true）
  autoGetIP: true,
  
  // 局域网IP获取接口地址（可选）
  localIPApi: 'http://localhost:8080/api/getLocalIp',
  
  // 自定义初始化函数（可选）
  init: () => {
    console.log('日志系统自定义初始化完成');
  }
});
\`\`\`

**初始化配置说明**:

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| \`routes\` | \`RouteItem[]\` | \`[]\` | 路由配置数组，用于构建路由-模块映射表 |
| \`level\` | \`LogLevel\` | \`DEBUG\` | 日志级别，只输出大于等于该级别的日志 |
| \`consoleEnabled\` | \`boolean\` | \`true\` | 是否在控制台输出日志 |
| \`currentUser\` | \`{ userName, userId }\` | \`{ userName: '神秘小李', userId: '9527' }\` | 当前用户信息 |
| \`autoGetIP\` | \`boolean\` | \`true\` | 是否自动获取IP地址 |
| \`localIPApi\` | \`string\` | \`http://localhost:8080/api/getLocalIp\` | 局域网IP获取接口 |
| \`init\` | \`() => void\` | \`undefined\` | 自定义初始化函数 |

**自动功能**:
1. **路由-模块映射**: 根据路由配置自动构建路径到模块名的映射表，日志记录时自动推断所在模块
2. **IP自动获取**: 异步获取公网IP和局域网IP，不阻塞初始化流程
3. **用户信息监听**: 自动监听用户状态变化，实时更新日志中的用户信息

### 12.3、快速开始

#### 基础日志记录

\`\`\`typescript
import { LeeLogger, OPERATION_TYPE, LOG_LEVEL } from '@/layout/utils/leeLogger';

// 记录不同级别的日志
LeeLogger.debug('调试信息', { data: 'debug data' });
LeeLogger.info('用户登录成功');
LeeLogger.warn('警告：配置项缺失', { config: 'apiUrl' });
LeeLogger.error('请求失败', { api: '/users', error: 'timeout' });
LeeLogger.fatal('系统崩溃', { error: new Error('Critical error') });
\`\`\`

#### 结构化日志记录

\`\`\`typescript
// 使用 createLog 方法创建结构化日志
LeeLogger.createLog({
  level: LOG_LEVEL.INFO,
  message: '用户登录',
  operation: OPERATION_TYPE.LOGIN,
  module: '用户认证',
  status: OPERATION_STATUS.SUCCESS,
  data: { username: 'admin', loginTime: new Date() }
});
\`\`\`

#### 设置当前用户

\`\`\`typescript
// 设置当前用户信息（会自动更新到后续日志中）
LeeLogger.setCurrentUser('张三', 'user_123');

// 清除用户信息（重置为默认用户）
LeeLogger.clearCurrentUser();
\`\`\`

#### 设置当前路由

\`\`\`typescript
// 设置当前路由（通常在路由变化时自动调用）
LeeLogger.setCurrentRoute('/dashboard');
\`\`\`

#### 日志查询和筛选

\`\`\`typescript
// 获取所有日志
const allLogs = LeeLogger.getLogs();

// 筛选日志
const errorLogs = LeeLogger.filterLogs({
  level: LOG_LEVEL.ERROR,
  module: '用户管理',
  operation: OPERATION_TYPE.DELETE,
  startTime: Date.now() - 24 * 60 * 60 * 1000, // 最近24小时
  endTime: Date.now(),
  userName: '张三'
});

// 清空所有日志
LeeLogger.clearLogs();
\`\`\`

#### 日志导出

\`\`\`typescript
// 导出为 JSON 格式
LeeLogger.exportLogs('json', 'app-logs');

// 导出为 CSV 格式
LeeLogger.exportLogs('csv', 'app-logs');

// 导出为 TXT 格式
LeeLogger.exportLogs('txt', 'app-logs');
\`\`\`

### 12.4、日志装饰器

**装饰器名称**: \`@LeeLoggerMethod\`

**使用场景**: 在 Service 类的方法上使用，自动记录方法调用日志

**前置条件**: 项目已在 \`vite.config.ts\` 中配置装饰器支持（Stage 3 标准）

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: false,  // 使用新版装饰器（Stage 3）
        useDefineForClassFields: true,
      },
    },
  },
});
\`\`\`

**使用示例**:

\`\`\`typescript
import { LeeLoggerMethod, LOG_LEVEL, OPERATION_TYPE } from '@/layout/utils/leeLogger';
import { LeeApiPermission } from '@/layout/utils/leePermission';

export class LoginService {
  // 方法级日志装饰器
  @LeeApiPermission('/login')  // ⚠️ 权限装饰器必须在最外层
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户认证',
    operation: OPERATION_TYPE.LOGIN,
  })
  async login(data: LoginInfo) {
    return await $post('/login', data);
  }

  @LeeApiPermission('/logout')
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户认证',
    operation: OPERATION_TYPE.LOGOUT,
  })
  async logout() {
    return await $post('/logout');
  }

  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户管理',
    operation: OPERATION_TYPE.CREATE,
  })
  async createUser(user: User) {
    return await $post('/user/create', user);
  }
}
\`\`\`

**装饰器配置**:

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| \`level\` | \`LogLevel\` | 是 | 日志级别 |
| \`module\` | \`string\` | 否 | 所在模块（未提供时自动推断） |
| \`operation\` | \`OperationType \\| string\` | 否 | 执行操作 |

**装饰器特性**:
- ✅ 自动记录方法调用开始和结束
- ✅ 自动记录方法参数和返回值
- ✅ 自动记录执行时间
- ✅ 自动捕获异常并记录错误日志
- ✅ 支持异步方法

**注意事项**:
1. 本项目使用 **Stage 3 装饰器**（新标准），不是旧版 experimentalDecorators
2. 无需在 tsconfig.json 中启用 experimentalDecorators
3. Vite 的 esbuild 配置已处理装饰器转译
4. 装饰器执行顺序是由上到下，\`@LeeApiPermission\` 必须在最外层

### 12.5、日志管理页面

**路由**: \`/system-management/log-management\`  
**文件**: \`src/pages/system-management/log-management/index.tsx\`

**功能特性**:
- ✅ 日志列表展示（表格形式）
- ✅ 多维度筛选（级别/模块/操作/时间/用户）
- ✅ 日志导出（JSON/CSV/TXT）
- ✅ 日志统计（按级别/模块/操作统计）
- ✅ 日志详情查看
- ✅ 日志清空

**页面入口**: 系统管理 → 日志管理

---

## 十三、项目AI开发工具集成设计

### 13.1、AI工具支持

本项目针对主流AI编程工具进行了深度优化。

**支持的AI工具**:
- ✅ Cursor - AI代码编辑器
- ✅ Windsurf - Codeium AI编辑器
- ✅ Antigravity - Google Deepmind AI助手
- ✅ Continue - VS Code AI扩展
- ✅ Qoder / Kiro - AI编程助手

### 13.2、AI知识库体系

**llms.txt标准** - 为AI工具提供项目上下文

**知识库位置**:
\`\`\`
src_ai/ai-knowledge/
├── llms.txt.md                # llms.txt标准文档
├── lee-custom-llms-text/
│   ├── llms.txt               # 项目简洁版知识库
│   └── llms.full.txt          # 项目完整版知识库
├── ant-design-llms-text/
│   ├── llms.txt
│   └── llms-full.txt
└── ai-tools-config/
    ├── Cursor.md
    ├── Windsurf.md
    ├── Antigravity.md
    └── ...
\`\`\`

### 13.3、AI配置文件

- \`.cursorrules\` - Cursor配置
- \`.windsurf/\` - Windsurf配置
- \`.antigravity/\` - Antigravity配置

### 13.4、src vs src_ai

| 目录 | 用途 | 代码存放规则 |
| ---- | ---- | -------- |
| **src/** | 手动编写的代码 | 非独立功能 且 代码<500行 |
| **src_ai/** | AI生成的代码 | 独立功能 或 代码≥500行 |

**重要说明**：
- \`src_ai/\` 是**正式项目的一部分**，与 \`src/\` 共同构成完整项目
- **不是临时目录**，AI 代码无需迁移到 src/
- 通过 \`@AI\` 或 \`@ai\` 别名引用：\`import { Component } from '@AI/components/...'\`

**代码存放规则**（优先级从高到低）：
1. **独立功能** → 必须放 \`src_ai/\`（严禁放 \`src/\`）
2. **代码 ≥ 500 行** → 必须放 \`src_ai/\`
3. **代码 < 500 行 且 非独立功能** → 可放 \`src/\`

**AI生成代码存放示例**：
- ✅ 用户管理模块（独立功能） → \`src_ai/pages/user-management/\`
- ✅ 大型表单组件（>500行） → \`src_ai/components/advanced-form/\`
- ✅ 大型工具函数（>500行） → \`src_ai/utils/format.ts\`

---

## 十四、docs项目文档规范

### 14.1、文档目录结构

\`\`\`
docs/
├── 项目开发规范/
│   └── React 企业级项目框架设计规范.md (本文档)
├── 项目设计方案/
│   └── (设计方案文档)
└── 项目需求/
    └── (需求文档)
\`\`\`

### 14.2、文档编写规范

| 规范 | 说明 |
| ---- | ---- |
| **格式** | 统一使用Markdown格式 |
| **命名** | 中文文件名,清晰表达文档内容 |
| **结构** | 使用标题层级组织内容 |
| **链接** | 文档内部使用锚点链接，跨文档使用相对路径 |
| **更新** | 代码变更及时同步文档 |

### 14.3、文档类型

1. **开发规范** - 编码规范、架构设计、最佳实践
2. **设计方案** - 功能设计、技术方案
3. **需求文档** - 业务需求、功能需求
4. **API文档** - 接口文档(可使用Swagger)

### 14.4、文档展示

项目内置了文档中心功能，可自动扫描并展示项目文档。

**功能入口**: \`文档中心\` (左侧菜单)

**技术实现**:
- **扫描机制**: 使用 Vite 的 \`import.meta.glob\` 自动扫描 \`docs/\` (项目文档) 和 \`docs/ai_docs/\` (AI文档) 目录下的 Markdown 文件。
- **渲染引擎**: 使用 \`react-markdown\` 配合 \`remark-gfm\` 插件，支持 GitHub Flavored Markdown 语法（表格、任务列表等）。
- **展示交互**: 使用 Ant Design 的 \`Table\` 列表展示，支持按名称搜索和按类型筛选；使用 \`Drawer\` 抽屉侧滑预览文档内容。

**目录映射**:

| 文档类型 | 对应目录 | 页面标签 |
| -------- | -------- | -------- |
| 项目文档 | \`docs/*.md\` | <span style="background:#e6f7ff;color:#1890ff;padding:2px 8px;">项目文档</span> |
| AI 文档 | \`docs/ai_docs/*.md\` | <span style="background:#f9f0ff;color:#722ed1;padding:2px 8px;">AI 文档</span> |

---


## 十五、项目版本管理规范

### 15.1、版本号命名规则

项目采用 **语义化版本规范（SemVer）**，版本号格式为：\`MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]\`

| 版本段                     | 说明         | 触发条件                                | 示例                                          |
| -------------------------- | ------------ | --------------------------------------- | --------------------------------------------- |
| **MAJOR（主版本号）**      | 重大变更版本 | 不兼容的 API 修改、架构重构、破坏性更新 | \`1.0.0\` → \`2.0.0\`                             |
| **MINOR（次版本号）**      | 功能版本     | 向下兼容的功能新增                      | \`1.0.0\` → \`1.1.0\`                             |
| **PATCH（修订版本号/补丁版本）**    | 修复版本     | 向下兼容的问题修复                      | \`1.0.0\` → \`1.0.1\`                             |
| **PRERELEASE（先行版本）** | 预发布标识   | 测试版本、候选版本                      | \`1.0.0-alpha.1\`、\`1.0.0-beta.2\`、\`1.0.0-rc.1\` |
| **BUILD（构建元数据）**    | 构建信息     | CI/CD 构建号                            | \`1.0.0+20260121\`                              |

#### 先行版本标识说明

| 标识                     | 说明       | 适用场景                     |
| ------------------------ | ---------- | ---------------------------- |
| \`alpha\`                  | 内部测试版 | 功能未完成，可能存在较多 Bug |
| \`beta\`                   | 公开测试版 | 功能基本完成，进行用户测试   |
| \`rc\` (Release Candidate) | 候选发布版 | 准备正式发布，进行最终验证   |

#### 版本号示例

\`\`\`text
1.0.0          # 正式发布版本
1.0.1          # Bug 修复版本
1.1.0          # 新功能版本
2.0.0          # 重大更新版本
1.0.0-alpha.1  # 第一个 Alpha 测试版
1.0.0-beta.1   # 第一个 Beta 测试版
1.0.0-rc.1     # 第一个候选发布版
1.0.0+build.123 # 包含构建号的版本
\`\`\`

### 15.2、版本发布规范

#### 发布类型与周期

| 发布类型         | 发布周期            | 说明                     |
| ---------------- | ------------------- | ------------------------ |
| **主版本发布**   | 按需（通常 1-2 年） | 重大架构升级、不兼容更新 |
| **次版本发布**   | 每月/每季度         | 新功能迭代               |
| **修订版本发布** | 按需（随时）        | 紧急 Bug 修复            |
| **先行版本发布** | 按开发进度          | 测试验证                 |

#### 发布流程

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│  1. 版本规划                                                 │
│     - 确定版本号                                             │
│     - 整理更新内容（Changelog）                              │
│     - 评估影响范围                                           │
├─────────────────────────────────────────────────────────────┤
│  2. 开发完成                                                 │
│     - 功能开发完成                                           │
│     - 代码审查通过                                           │
│     - 单元测试通过                                           │
├─────────────────────────────────────────────────────────────┤
│  3. 测试验证                                                 │
│     - 集成测试                                               │
│     - 回归测试                                               │
│     - 性能测试（如需要）                                     │
├─────────────────────────────────────────────────────────────┤
│  4. 版本发布                                                 │
│     - 更新 package.json 版本号                               │
│     - 更新 CHANGELOG.md                                      │
│     - 创建 Git Tag                                           │
│     - 合并到主分支                                           │
├─────────────────────────────────────────────────────────────┤
│  5. 发布后                                                   │
│     - 部署到生产环境                                         │
│     - 监控系统稳定性                                         │
│     - 发布通知                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### 版本更新检查清单

| 检查项                       | 说明               |
| ---------------------------- | ------------------ |
| ✅ package.json 版本号已更新 | 与发布版本一致     |
| ✅ CHANGELOG.md 已更新       | 记录本次更新内容   |
| ✅ version-log.md 已更新     | 详细版本日志       |
| ✅ 所有测试通过              | 单元测试、集成测试 |
| ✅ 代码审查完成              | PR 已审核通过      |
| ✅ 文档已更新                | API 文档、使用说明 |
| ✅ Git Tag 已创建            | 版本标签           |



---

## 十六、Git 代码仓库管理规范

### 16.1、Git Tag 版本规范

#### Tag 命名规则

| Tag 类型 | 格式 | 示例 | 说明 |
| --- | --- | --- | --- |
| 正式版本 | \`v{MAJOR}.{MINOR}.{PATCH}\` | \`v1.0.0\`、\`v2.1.3\` | 正式发布版本 |
| 先行版本 | \`v{VERSION}-{PRERELEASE}\` | \`v1.0.0-alpha.1\`、\`v1.0.0-rc.1\` | 测试版本 |
| 里程碑版本 | \`v{VERSION}-{MILESTONE}\` | \`v1.0.0-mvp\`、\`v2.0.0-launch\` | 重要里程碑 |

#### Tag 创建规范

\`\`\`bash
# 创建轻量标签（不推荐用于版本发布）
git tag v1.0.0

# 创建附注标签（推荐用于版本发布）
git tag -a v1.0.0 -m "Release version 1.0.0"

# 创建带详细说明的标签
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- 新增用户管理模块
- 新增角色权限系统

Bug Fixes:
- 修复登录页面样式问题
- 修复路由跳转异常"

# 推送标签到远程仓库
git push origin v1.0.0

# 推送所有标签
git push origin --tags
\`\`\`

#### Tag 管理操作

\`\`\`bash
# 查看所有标签
git tag -l

# 查看特定版本标签
git tag -l "v1.*"

# 查看标签详情
git show v1.0.0

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0

# 检出特定标签
git checkout v1.0.0

# 基于标签创建分支
git checkout -b hotfix/v1.0.1 v1.0.0
\`\`\`

### 16.2、分支管理策略

#### 分支类型

| 分支类型        | 命名规范            | 生命周期 | 说明                             |
| --------------- | ------------------- | -------- | -------------------------------- |
| **master/main** | \`master\` 或 \`main\`  | 永久     | 生产环境分支，保持稳定可发布状态 |
| **develop**     | \`develop\` 或 \`dev\`  | 永久     | 开发主分支，集成最新开发代码     |
| **feature**     | \`feature/{功能名}\`  | 临时     | 功能开发分支                     |
| **bugfix**      | \`bugfix/{问题描述}\` | 临时     | Bug 修复分支（非紧急）           |
| **hotfix**      | \`hotfix/{问题描述}\` | 临时     | 紧急修复分支（生产环境问题）     |
| **release**     | \`release/{版本号}\`  | 临时     | 版本发布分支                     |

#### 分支命名规范

\`\`\`text
# 功能分支
feature/user-management          # 用户管理功能
feature/login-optimization       # 登录优化
feature/dashboard-chart          # 仪表盘图表

# Bug 修复分支
bugfix/login-style-issue         # 登录样式问题
bugfix/router-redirect-error     # 路由重定向错误

# 紧急修复分支
hotfix/security-vulnerability    # 安全漏洞修复
hotfix/production-crash          # 生产环境崩溃

# 发布分支
release/v1.0.0                   # 1.0.0 版本发布
release/v1.1.0                   # 1.1.0 版本发布
\`\`\`

#### 分支流程图

\`\`\`text
                    ┌─────────────────────────────────────────────────┐
                    │                    master                       │
                    │  (生产环境，只接受 release 和 hotfix 合并)        │
                    └─────────────────────────────────────────────────┘
                              ↑                           ↑
                              │ merge                     │ merge
                              │                           │
                    ┌─────────┴─────────┐       ┌─────────┴─────────┐
                    │  release/v1.0.0   │       │  hotfix/xxx       │
                    │  (版本发布分支)    │       │  (紧急修复分支)    │
                    └─────────┬─────────┘       └─────────┬─────────┘
                              ↑                           ↑
                              │ merge                     │ 从 master 创建
                              │                           │
┌─────────────────────────────┴───────────────────────────────────────┐
│                           develop                                   │
│  (开发主分支，集成所有功能)                                           │
└─────────────────────────────────────────────────────────────────────┘
           ↑                    ↑                    ↑
           │ merge              │ merge              │ merge
           │                    │                    │
┌──────────┴──────┐  ┌──────────┴──────┐  ┌──────────┴──────┐
│ feature/user    │  │ feature/chart   │  │ bugfix/style    │
│ (功能分支)       │  │ (功能分支)       │  │ (修复分支)       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
\`\`\`

### 16.3、分支合并规则

#### 合并方向

| 源分支     | 目标分支   | 合并方式                    | 说明                        |
| ---------- | ---------- | --------------------------- | --------------------------- |
| feature/\\* | develop    | Squash Merge / Merge Commit | 功能完成后合并到开发分支    |
| bugfix/\\*  | develop    | Squash Merge / Merge Commit | Bug 修复后合并到开发分支    |
| develop    | release/\\* | Merge Commit                | 准备发布时创建 release 分支 |
| release/\\* | master     | Merge Commit                | 版本发布时合并到主分支      |
| release/\\* | develop    | Merge Commit                | 发布后同步回开发分支        |
| hotfix/\\*  | master     | Merge Commit                | 紧急修复合并到主分支        |
| hotfix/\\*  | develop    | Merge Commit                | 紧急修复同步到开发分支      |

#### 合并方式说明

| 合并方式         | 命令                 | 适用场景                       |
| ---------------- | -------------------- | ------------------------------ |
| **Merge Commit** | \`git merge --no-ff\`  | 保留完整历史，适合重要分支合并 |
| **Squash Merge** | \`git merge --squash\` | 压缩为单个提交，适合功能分支   |
| **Rebase**       | \`git rebase\`         | 线性历史，适合个人分支整理     |

#### 合并前检查清单

| 检查项               | 说明                  |
| -------------------- | --------------------- |
| ✅ 代码审查已完成    | PR 已获得至少一人批准 |
| ✅ CI/CD 流水线通过  | 构建、测试全部通过    |
| ✅ 无合并冲突        | 已解决所有冲突        |
| ✅ 提交信息规范      | 符合 Commit 规范      |
| ✅ 关联 Issue 已标注 | 关联相关任务或 Bug    |

### 16.4、Commit 提交规范

#### Commit Message 格式

采用 **Conventional Commits** 规范：

\`\`\`text
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

#### Type 类型说明

| Type         | 说明                   | 示例                                   |
| ------------ | ---------------------- | -------------------------------------- |
| **feat**     | 新功能                 | \`feat(user): 添加用户列表分页功能\`     |
| **fix**      | Bug 修复               | \`fix(login): 修复登录页面样式错位问题\` |
| **docs**     | 文档更新               | \`docs(readme): 更新项目说明文档\`       |
| **style**    | 代码格式（不影响功能） | \`style(global): 统一代码缩进格式\`      |
| **refactor** | 代码重构               | \`refactor(utils): 重构请求封装模块\`    |
| **perf**     | 性能优化               | \`perf(list): 优化大数据列表渲染性能\`   |
| **test**     | 测试相关               | \`test(user): 添加用户模块单元测试\`     |
| **build**    | 构建相关               | \`build(vite): 升级 Vite 到 7.0 版本\`   |
| **ci**       | CI/CD 相关             | \`ci(github): 添加 GitHub Actions 配置\` |
| **chore**    | 其他杂项               | \`chore(deps): 更新项目依赖\`            |
| **revert**   | 回滚提交               | \`revert: 回滚 feat(user) 提交\`         |

#### Scope 范围说明

| Scope    | 说明     |
| -------- | -------- |
| \`user\`   | 用户模块 |
| \`auth\`   | 认证模块 |
| \`login\`  | 登录模块 |
| \`layout\` | 布局模块 |
| \`router\` | 路由模块 |
| \`store\`  | 状态管理 |
| \`utils\`  | 工具函数 |
| \`config\` | 配置相关 |
| \`deps\`   | 依赖相关 |
| \`global\` | 全局相关 |

#### Subject 规范

| 规则             | 说明                         |
| ---------------- | ---------------------------- |
| 使用中文或英文   | 团队统一即可                 |
| 不超过 50 个字符 | 保持简洁                     |
| 使用动词开头     | 添加、修复、更新、删除、优化 |
| 不以句号结尾     | 标题不需要标点               |

#### Commit 示例

\`\`\`bash
# 新功能
feat(user): 添加用户列表分页功能

实现用户列表的分页展示功能，支持自定义每页数量。

- 添加分页组件
- 实现前端分页逻辑
- 对接后端分页接口

Closes #123

# Bug 修复
fix(login): 修复登录页面在移动端的样式问题

修复登录页面在移动端设备上按钮无法点击的问题。

Fixes #456

# 文档更新
docs(readme): 更新项目安装说明

# 代码重构
refactor(request): 重构 Axios 请求封装

将请求拦截器和响应拦截器拆分为独立模块，提高代码可维护性。

# 性能优化
perf(table): 优化表格大数据渲染性能

使用虚拟列表技术优化超过 1000 行数据的表格渲染性能。

# 依赖更新
chore(deps): 升级 React 到 19.0.0

BREAKING CHANGE: 需要 Node.js 18+ 版本
\`\`\`

### 16.5、Pull Request 规范

#### PR 标题格式

\`\`\`text
<type>(<scope>): <description>
\`\`\`

示例：

- \`feat(user): 添加用户管理模块\`
- \`fix(login): 修复登录验证问题\`
- \`docs(api): 更新 API 接口文档\`

#### PR 描述模板

\`\`\`markdown
## 📝 变更说明

<!-- 简要描述本次变更的内容 -->

## 🔗 关联 Issue

<!-- 关联的 Issue 编号 -->

Closes #123

## 📋 变更类型

- [ ] 新功能 (feat)
- [ ] Bug 修复 (fix)
- [ ] 文档更新 (docs)
- [ ] 代码重构 (refactor)
- [ ] 性能优化 (perf)
- [ ] 测试相关 (test)
- [ ] 构建相关 (build)
- [ ] 其他 (chore)

## 🧪 测试说明

<!-- 描述如何测试本次变更 -->

## 📸 截图（如有 UI 变更）

<!-- 附上变更前后的截图对比 -->

## ✅ 自检清单

- [ ] 代码符合项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 已添加/更新测试用例
- [ ] 本地测试通过
\`\`\`

### 16.6、其他 Git 规范

#### .gitignore 规范

\`\`\`gitignore
# 依赖目录
node_modules/
.pnp/
.pnp.js

# 构建产物
dist/
dist-ssr/
build/
*.local

# 环境变量（敏感信息）
.env.local
.env.*.local

# 日志文件
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 编辑器配置
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.sublime-project
*.sublime-workspace

# 操作系统文件
.DS_Store
Thumbs.db

# 测试覆盖率
coverage/
*.lcov

# 缓存目录
.cache/
.parcel-cache/
.eslintcache
.stylelintcache

# 临时文件
*.tmp
*.temp
\`\`\`

#### Git Hooks 配置（推荐使用 Husky）

\`\`\`json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{scss,css}": ["stylelint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
\`\`\`

\`\`\`bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit \${1}
\`\`\`

#### Commitlint 配置

\`\`\`javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
  },
};
\`\`\`

#### 代码审查规范

| 审查要点       | 说明                   |
| -------------- | ---------------------- |
| **功能完整性** | 功能是否按需求实现     |
| **代码质量**   | 是否符合编码规范       |
| **性能影响**   | 是否存在性能问题       |
| **安全性**     | 是否存在安全隐患       |
| **可维护性**   | 代码是否易于理解和维护 |
| **测试覆盖**   | 是否有充分的测试       |

---

## 十七、代码注释规范

### 17.1、变量、js/ts函数注释
- 必须采用/***/方式注释
- 注释案例：
\`\`\`js
/**
 * 登录信息表单
 */
const loginInfoForm = {
  username:"小李同学", // 用户名
  password:"admin123" // 密码
}

/**
 * 登录函数
 * @param {String} username 用户名
 * @param {String} password 密码
 * @return {String} username
 */
function login(username,password){
  return username
}
\`\`\`

### 17.2、css样式注释
- css/scss/less等样式文件页头需要按照下方注释
\`\`\`css
/**
 * @format
 * @Name : lee.css
 * @DateTime: 2026/01/23
 * @Desc : lee 的 css 文件,用来存放lee的公用样式类
 * @Use : 这是对当前文件的使用方法示例
 */
\`\`\`
- 普通样式类的scss/css/less注释方法
\`\`\`scss

// ========================================================================================================//
// ============================      SCSS Variables Area      =============================================//
// ============================      SCSS 变量区域              =============================================//
// ========================================================================================================//

/*
****************    Colors    *************** 
****************    Colors    *************** 
****************    Colors    *************** 
*/
// Common Colors
$color-blue-1: #155eef;
$color-gray-1: #eee;
// Background color
$color-background: #f2f4f7;

// ========================================================================================================//
// ========================================================================================================//
// ===============                    以下继承类与混入类非高频率使用，切勿增加!!!                ================ //
// ===============                    以下继承类与混入类非高频率使用，切勿增加!!!                ================ //
// ===============                    以下继承类与混入类非高频率使用，切勿增加!!!                ================ //
// ========================================================================================================//
// ========================================================================================================//

/**
* mixin/include 混合(混入)
*/
@mixin flex-align-center {
  display: flex;
  align-items: center;
}
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

### 17.3、tsx文件注释
- 使用标准规范代码注释，如：变量函数、变量、函数使用/***/方式，普通注释使用 // 方式
- 参考下方示例
\`\`\`tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenService } from "@/services/login";
import "./index.scss";

/**
 * 中转站页面
 * 用于检查用户登录状态并跳转到相应页面
 */
const TransferStation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenService()
      .then((res: boolean) => {
        if (res) {
          // Token 有效，跳转到主应用
          navigate("/dashboard", { replace: true });
        } else {
          // Token 无效，跳转到登录页
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Token validation error:", err);
        // 发生错误，跳转到登录页
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="transfer-station">
      <div className="loader"></div>
    </div>
  );
};

export default TransferStation;

\`\`\`

### 17.4、bash文件注释
- 包含以下文件：.env.development / .gitignore / .prettierignore 等其他未命名文件后缀的文件
- 参考下方示例
\`\`\`bash
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local
# 工具配置不能继续忽略提交，因为会存在相关的ai工具配置
# .vscode/*
# .idea
# .antigravity
# .continue
# .cursorrules
# .windsurf
# .kiro.yaml
# .qoder.json

# Editor directories and files
!.vscode/extensions.json
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

\`\`\`

### 17.5、json文件注释
- json文件注释方法,参考下方示例
\`\`\`json
{
  "// 项目知识库": "指向项目的 llms.txt 文件，供 AI 工具理解项目",
  "knowledgeBase": {
    "primary": "src_ai/ai-knowledge/lee-custom-llms-text/llms.txt",
    "additional": ["src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt"]
  },

  "// GitHub Copilot": "GitHub Copilot 配置",
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.advanced": {
    "debug.overrideEngine": "gpt-4"
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "github.copilot.editor.enableCodeActions": true,

  "// Codeium": "Codeium AI 配置",
  "codeium.enableConfig": {
    "*": true
  },
  "codeium.enableCodeLens": true,
  "codeium.enableSearch": true,
  "codeium.enableChatMode": true,
  
  "// prettier": "prettier 配置",
  "prettier.enable": true,
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": false,

  "path-intellisense.mappings": {
    "@": "\${workspaceFolder}/src",
    "@AI": "\${workspaceFolder}/src_ai",
    "@ai": "\${workspaceFolder}/src_ai"
  }
}

\`\`\`

---

---

## 十八、项目多模式版本拓展

### 18.1、纯前端模式

**适用场景**: 静态展示站、无后端逻辑的工具类应用、完全依赖第三方公开API（无跨域或已解决跨域）的应用。

**特点**:
- 无本地Mock数据。
- 依赖构建时的静态资源或运行时直接请求外部API。
- 部署简单，通常部署在CDN或静态服务器（如Nginx/GitHub Pages）。

**配置开关**:
- \`.env\` 中设置 \`VITE_APP_USE_MOCK=false\`
- 确保 API 请求直接指向真实后端或留空。

### 18.2、Api 接口模式

**适用场景**: 标准的前后端分离开发模式，对接真实的研发中或已上线的后端服务。

**特点**:
- 所有的请求都代理或直接请求到真实的后端接口。
- 需要配合 \`vite.config.ts\` 中的 \`proxy\` 配置解决开发环境跨域问题。

**配置**:
\`\`\`typescript
// vite.config.ts
proxy: {
  '/api': {
    target: env.VITE_APP_API_URL, // 真实后端地址
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\\/api/, '')
  }
}
\`\`\`

### 18.3、Mock 数据模拟模式

**适用场景**: 后端接口尚未开发完成，或者需要离线开发、演示demo时。

**特点**:
- 使用 Mock.js 或类似的库在前端拦截请求并返回模拟数据。
- 不发送真实网络请求（或通过Service Worker拦截）。
- 数据通常存储在内存中，刷新页面重置。

**配置开关**:
- \`.env\` 中设置 \`VITE_APP_USE_MOCK=true\`
- 项目中需引入 Mock 插件（如 \`vite-plugin-mock\`）。

### 18.4、koa sqllite 模式

**适用场景**: 全栈开发演示、BFF（Backend For Frontend）层开发、轻量级独立应用（无需独立部署大型数据库）。

**特点**:
- 在开发环境中启动一个轻量级的 Node.js (Koa) 服务。
- 使用 SQLite 作为本地文件数据库，无需安装 MySQL/PostgreSQL。
- 前端请求指向本地 Koa 服务。
- 数据可持久化保存到本地 \`.db\` 文件。

**实现方式**:
- 在 \`server/\` 目录下维护 Koa 服务代码。
- 使用 \`better-sqlite3\` 或 \`prisma\` 操作 SQLite。
- \`npm run dev\` 时同时启动 Vite 和 Koa 服务（可使用 \`concurrently\`）。

---

## 十九、开发工具链

### 19.1、开发命令

| 命令              | 说明               |
| ----------------- | ------------------ |
| \`npm run dev\`     | 启动开发服务器     |
| \`npm run mock\`    | 启动 Mock 数据模式 |
| \`npm run build\`   | 构建生产版本       |
| \`npm run preview\` | 预览构建结果       |
| \`npm run lint\`    | 代码检查           |
| \`npm run format\`  | 代码格式化         |

### 19.2、推荐 VSCode 插件

| 插件                      | 用途                           |
| ------------------------- | ------------------------------ |
| ESLint                    | JavaScript/TypeScript 代码检查 |
| Prettier                  | 代码格式化                     |
| Tailwind CSS IntelliSense | TailwindCSS 智能提示           |
| TypeScript Vue Plugin     | Vue/React 类型支持             |
| Auto Rename Tag           | 自动重命名标签                 |
| Path Intellisense         | 路径智能提示                   |

### 19.3、浏览器插件

| 插件                  | 用途                     |
| --------------------- | ------------------------ |
| React Developer Tools | React 组件调试           |
| Redux DevTools        | 状态调试（兼容 Zustand） |

---

## 二十、最佳实践指南

### 20.1、组件设计原则

| 原则                    | 说明                 |
| ----------------------- | -------------------- |
| 单一职责                | 一个组件只做一件事   |
| 受控优先                | 优先使用受控组件     |
| 组合优于继承            | 使用组合模式复用逻辑 |
| Props 向下，Events 向上 | 数据流清晰可追溯     |
| 默认值友好              | 提供合理的默认 Props |

### 20.2、状态管理原则

| 层级       | 适用场景           | 工具                      |
| ---------- | ------------------ | ------------------------- |
| 组件状态   | 临时 UI 状态       | useState                  |
| 跨组件状态 | 父子/兄弟组件共享  | useContext / Props        |
| 页面状态   | 页面级业务状态     | 页面 store.ts             |
| 全局状态   | 用户信息/主题/语言 | Zustand                   |
| 服务端状态 | API 数据           | React Query / SWR（可选） |

### 20.3、性能优化清单

| 优化项     | 方法                      |
| ---------- | ------------------------- |
| 组件懒加载 | \`React.lazy\` + \`Suspense\` |
| 路由懒加载 | 动态 import               |
| 图片优化   | WebP 格式、懒加载         |
| 缓存优化   | \`useMemo\`、\`useCallback\`  |
| 虚拟列表   | 大数据列表优化            |
| 代码分割   | Vite 自动分包             |

### 20.4、安全最佳实践

| 实践      | 说明                           |
| --------- | ------------------------------ |
| XSS 防护  | 避免 \`dangerouslySetInnerHTML\` |
| CSRF 防护 | 使用 Token 验证                |
| 敏感数据  | 不在前端存储敏感信息           |
| HTTPS     | 生产环境强制 HTTPS             |
| 依赖安全  | 定期更新依赖、审计漏洞         |

---
`;export{n as default};
