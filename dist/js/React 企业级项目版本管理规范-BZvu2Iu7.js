const n=`# 📋 版本更新日志 (CHANGELOG)

> 本文档记录项目的所有版本变更，遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) 规范。

---

## 📖 版本号规范

### 语义化版本 (Semantic Versioning)

版本格式：\`MAJOR.MINOR.PATCH\`

| 版本号 | 说明 | 示例 |
|--------|------|------|
| MAJOR | 重大更新，包含不兼容的 API 变更 | 1.0.0 → 2.0.0 |
| MINOR | 功能更新，向下兼容的功能新增 | 1.0.0 → 1.1.0 |
| PATCH | 补丁更新，向下兼容的问题修复 | 1.0.0 → 1.0.1 |

### 变更类型标识

| 标识 | 说明 | 使用场景 |
|------|------|----------|
| ✨ Features | 新功能 | 新增功能特性 |
| 🐛 Bug Fixes | 修复 | 问题修复 |
| 💥 Breaking Changes | 破坏性变更 | 不兼容的改动 |
| ♻️ Refactor | 重构 | 代码重构，不影响功能 |
| 🎨 Styles | 样式 | UI/UX 样式调整 |
| ⚡ Performance | 性能 | 性能优化 |
| 📝 Documentation | 文档 | 文档更新 |
| 🔧 Configuration | 配置 | 配置文件变更 |
| 📦 Dependencies | 依赖 | 依赖更新 |
| 🧪 Tests | 测试 | 测试相关 |
| 🔒 Security | 安全 | 安全相关更新 |
| 🌐 i18n | 国际化 | 国际化相关 |

---

## 🚀 版本历史

### [未发布] - Unreleased

> 开发中的功能，尚未发布

#### ✨ Features
- 

#### 🐛 Bug Fixes
- 

---

### [0.1.0] - 2026-01-21

> 项目初始版本，完成基础框架搭建

#### ✨ Features

**核心架构**
- 初始化 React 19 + TypeScript + Vite 7 项目
- 配置路径别名 \`@/\` 和 TypeScript 严格模式
- 集成 ESLint 9 + Prettier 代码规范

**布局系统**
- 实现 LayoutManager 布局管理器
- 完成三种布局模式：
  - \`lee-basic\` - 基础布局（Header + Sidebar + Content）
  - \`lee-sidebar\` - 侧边栏布局（Sidebar + Content）
  - \`lee-top-menu\` - 顶部菜单布局（Header + Content）
- 实现布局模式运行时切换
- 实现侧边栏折叠/展开功能
- 完成面包屑导航组件

**主题系统**
- 实现明暗主题切换（light/dark）
- 基于 CSS 变量的主题系统
- 分层主题变量设计（框架层/业务层）
- 主题状态持久化

**国际化**
- 集成 i18next + react-i18next
- 支持中文（zh-CN）和英文（en-US）
- 实现框架层与业务层语言包分离
- 命名空间冲突检测机制
- 语言状态持久化

**状态管理**
- 集成 Zustand 5.x 状态管理
- 实现 layoutStore（布局状态）
- 实现 themeStore（主题状态）
- 实现 i18nStore（语言状态）
- 实现 menuStore（菜单状态）
- 实现 userStore（用户状态）
- 状态持久化中间件配置

**路由系统**
- 集成 React Router 7.x
- 实现静态路由 + 动态路由配置
- 路由懒加载（React.lazy + Suspense）
- 路由 Meta 信息支持
- 404 兜底路由

**登录模块**
- 完成登录页面 UI
- 支持多方式登录（账户/手机/邮箱）
- 表单验证
- Token 存储（localStorage + Cookie）
- 记住密码功能
- 登录页主题/语言切换

**错误页面**
- 403 无权限页面
- 404 页面不存在
- 500 服务器错误

#### 🎨 Styles

- 集成 Ant Design 6.x 组件库
- 集成 TailwindCSS 4.x
- SCSS 预处理器配置
- 全局样式变量体系

#### 🔧 Configuration

- Vite 构建配置
- TypeScript 配置（tsconfig.json）
- ESLint Flat Config 配置
- Prettier 代码格式化配置
- PostCSS + TailwindCSS 配置
- 环境变量配置（.env.development / .env.production）

#### 📦 Dependencies

**生产依赖**
| 依赖 | 版本 |
|------|------|
| react | 19.2.0 |
| react-dom | 19.2.0 |
| react-router-dom | 7.12.0 |
| antd | 6.1.4 |
| @ant-design/icons | 6.1.0 |
| zustand | 5.0.9 |
| axios | 1.13.2 |
| i18next | 25.7.4 |
| react-i18next | 16.5.1 |
| tailwindcss | 4.1.18 |
| sass | 1.97.2 |
| @logicflow/core | 2.1.7 |
| @logicflow/extension | 2.1.9 |
| js-cookie | 3.0.5 |
| lodash-es | 4.17.22 |
| nprogress | 0.2.0 |
| animate.css | 4.1.1 |
| localforage | 1.10.0 |

**开发依赖**
| 依赖 | 版本 |
|------|------|
| typescript | 5.9.3 |
| vite | 7.2.4 |
| @vitejs/plugin-react | 5.1.1 |
| eslint | 9.39.1 |
| typescript-eslint | 8.46.4 |
| @types/react | 19.2.5 |
| @types/react-dom | 19.2.3 |

#### 📝 Documentation

- 创建 README.md 项目说明文档
- 编写 React 企业级项目设计规则
- 编写 React 企业级项目需求文档
- 编写 React 主题色开发说明
- 编写 React i18n 国际化语言包开发说明
- 编写 React layout 布局模式开发说明

---

## 📝 版本记录模板

> 复制以下模板用于记录新版本

\`\`\`markdown
### [x.x.x] - YYYY-MM-DD

> 版本简要描述

#### ✨ Features
- 功能描述 (#issue-number)

#### 🐛 Bug Fixes
- 修复描述 (#issue-number)

#### 💥 Breaking Changes
- 破坏性变更描述

#### ♻️ Refactor
- 重构描述

#### 🎨 Styles
- 样式调整描述

#### ⚡ Performance
- 性能优化描述

#### 📝 Documentation
- 文档更新描述

#### 🔧 Configuration
- 配置变更描述

#### 📦 Dependencies
- 依赖更新描述
\`\`\`

---

## 📌 版本规划

### 下一版本计划 (v0.2.0)

- [ ] 权限系统
  - [ ] 路由权限控制
  - [ ] 菜单权限过滤
  - [ ] 按钮级权限控制
- [ ] 业务模块
  - [ ] 用户管理 CRUD
  - [ ] 角色管理 CRUD
  - [ ] 系统设置页面
- [ ] 示例页面
  - [ ] 表格示例
  - [ ] 表单示例
  - [ ] 图表示例

### 未来版本计划

- [ ] LogicFlow 流程编辑器集成
- [ ] 全局错误边界
- [ ] 请求缓存策略
- [ ] 页面缓存 (keep-alive)
- [ ] 更多主题色预设
- [ ] 更多语言支持

---

## 🔗 相关链接

- [项目仓库](https://github.com/your-username/react19_ts)
- [问题反馈](https://github.com/your-username/react19_ts/issues)
- [功能请求](https://github.com/your-username/react19_ts/issues/new)

---

> 最后更新：2026-01-21
`;export{n as default};
