# react19_ts 项目概述

> 基于 React 19 + TypeScript + Vite 7 的企业级后台管理系统

## 项目信息

- **项目名称**: react19_ts
- **类型**: React + TypeScript Web 应用
- **框架**: React 19.2.x + Vite 7.2.x

## 技术栈

### 核心框架
- React 19.2.x
- TypeScript 5.9.x
- Vite 7.2.x

### UI 框架
- Ant Design 6.1.x（禁用其他 UI 框架）

### 状态管理
- Zustand 5.0.x（禁用 Redux/MobX）

### 路由
- React Router 7.12.x

### 国际化
- i18next 25.7.x
- react-i18next 16.5.x

### 样式
- SCSS 1.97.x
- TailwindCSS 4.1.x

## 路径别名

- `@/` → `src/`
- `@AI/` 或 `@ai/` → `src_ai/`

## 代码组织规则

- 代码 < 500 行 → 放入 `src/` 对应目录
- 代码 ≥ 500 行 → 放入 `src_ai/` 对应目录
- `src_ai/` 是项目正式组成部分，不是临时目录

## 命名规范

- **目录**: kebab-case（例如: `user-management`）
- **组件**: PascalCase（例如: `UserCard.tsx`）
- **Hooks**: `use-xxx.ts`（例如: `use-auth.ts`）
- **样式文件**: `styles.scss`
- **工具函数**: camelCase（例如: `getUserInfo`）

## 代码规范

- 使用 TypeScript strict mode
- 遵循 ESLint + Prettier 规范
- 使用函数式组件 + Hooks
- 导入顺序: React → 第三方库 → 本地模块

## 组件规则

- 一个组件一个文件
- 使用 `index.tsx` 作为入口点
- 样式文件命名为 `styles.scss`
- 类型定义放在 `types.ts` 文件中

## 知识库文件

项目使用以下知识库文件提供更详细的开发规范：

- **核心规则**: `src_ai/ai-knowledge/lee-custom-llms-text/llms.txt`
- **完整规则**: `src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt`

生成代码前，请先阅读这些知识库文件。
