# llms.txt

    一项提议是统一采用一个“llms.txt”文件来提供相关信息，以便让语言模型在推理时能够使用该网站。

    大型语言模型越来越多地依赖网站信息，但面临着一个关键的限制：其语境窗口太小，无法完整处理大多数网站的内容。将带有导航、广告和 JavaScript 的复杂 HTML 页面转换为适合大型语言模型处理的纯文本既困难又不准确。
    虽然网站既为人类读者提供服务，也为语言模型提供信息，但后者却能从一个集中的、易于获取的位置获得更简洁、专家级别的信息。这对于诸如开发环境之类的应用场景尤为重要，因为在这些场景中，语言模型需要快速获取编程文档和 API 的相关信息。

## llms.txt 的官方文档地址

- [llms.txt 官方文档](https://llmstxt.org/)

## 什么是 llms.txt？

- 我们支持通过 llms.txt 文件向大语言模型（LLMs）提供 代码知识库 与 代码编写规则边界。此功能可帮助 AI 工具更好地理解我们的API、项目结构、项目目标、项目背景、项目约束、项目限制 及其他的一切你想要告诉 AI 的内容。

## llms.txt 的位置

- llms.txt 文件应该放在 ai-knowledge 目录下。

## 如何创建一个有效的 llms.txt 文件

- 要创建有效的 llms.txt 文件，请遵循以下指南：

- 使用简洁明了的语言。
- 在链接资源时，请附上简短且内容详实的描述。
- 避免使用含糊不清的术语或未作解释的行话。
- 使用一个将您的 llms.txt 文件扩展为 LLM 上下文文件的工具，并测试多个语言模型，以查看它们是否能够回答有关您内容的问题。
- md写法应遵循以下标签，便于ai更快的理解与识别：

### Markdown 标签最佳实践（按 AI 识别速度排序）

#### 🚀 极快识别（推荐优先使用）

1. **标题层级（H1-H6）**
   ```markdown
   # 一级标题 (H1) - 文档主标题
   ## 二级标题 (H2) - 主要章节
   ### 三级标题 (H3) - 子章节
   #### 四级标题 (H4) - 详细分类
   ```
   - ✅ AI 识别速度：最快
   - ✅ 用途：文档结构、章节划分
   - ✅ 建议：保持层级清晰，不要跳级

2. **分隔线**
   ```markdown
   ---
   或
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------
   ```
   - ✅ AI 识别速度：极快
   - ✅ 用途：章节分隔、视觉区分
   - ✅ 建议：用于重要章节之间的分隔

3. **列表（有序/无序）**
   ```markdown
   - 无序列表项
   * 无序列表项
   
   1. 有序列表项
   2. 有序列表项
   ```
   - ✅ AI 识别速度：极快
   - ✅ 用途：规则列表、步骤说明
   - ✅ 建议：保持缩进一致

4. **代码块**
   ```markdown
   \`\`\`typescript
   const example = 'code';
   \`\`\`
   ```
   - ✅ AI 识别速度：极快
   - ✅ 用途：代码示例、配置文件
   - ✅ 建议：指定语言类型

#### ⚡ 快速识别（建议使用）

5. **粗体/斜体**
   ```markdown
   **粗体文本** - 强调重点
   *斜体文本* - 次要强调
   ***粗斜体*** - 最强调
   ```
   - ✅ AI 识别速度：快
   - ✅ 用途：关键词强调
   - ✅ 建议：用于规则名称、重要概念

6. **引用块**
   ```markdown
   > 这是引用内容
   > 可以多行
   ```
   - ✅ AI 识别速度：快
   - ✅ 用途：说明文字、注意事项
   - ✅ 建议：用于规则说明、警告提示

7. **链接**
   ```markdown
   [链接文字](URL)
   [文档标题](./path/to/file.md)
   ```
   - ✅ AI 识别速度：快
   - ✅ 用途：文档引用、外部资源
   - ✅ 建议：提供清晰的链接描述

8. **表格**
   ```markdown
   | 列1 | 列2 | 列3 |
   |-----|-----|-----|
   | 值1 | 值2 | 值3 |
   ```
   - ✅ AI 识别速度：快
   - ✅ 用途：数据对比、规则总结
   - ✅ 建议：保持列对齐

#### 🔍 中速识别（适度使用）

9. **任务列表**
   ```markdown
   - [ ] 未完成任务
   - [x] 已完成任务
   ```
   - ⚠️ AI 识别速度：中等
   - ✅ 用途：检查清单、自检列表
   - ✅ 建议：用于自检机制

10. **Emoji 表情**
    ```markdown
    ✅ 成功  ❌ 失败  ⚠️ 警告  🌟 重要  📋 列表
    ```
    - ⚠️ AI 识别速度：中等
    - ✅ 用途：视觉标记、优先级标注
    - ✅ 建议：配合文字使用，不要单独使用

11. **嵌套列表**
    ```markdown
    - 一级列表
      - 二级列表
        - 三级列表
    ```
    - ⚠️ AI 识别速度：中等
    - ✅ 用途：层级关系、规则细分
    - ✅ 建议：不超过3层嵌套

#### 🐌 慢速识别（谨慎使用）

12. **HTML 标签**
    ```markdown
    <div>HTML 内容</div>
    <details><summary>折叠内容</summary></details>
    ```
    - ❌ AI 识别速度：慢
    - ⚠️ 用途：特殊格式、复杂布局
    - ⚠️ 建议：尽量避免，优先使用纯 Markdown

13. **复杂嵌套结构**
    ```markdown
    > **引用中的粗体**
    > - 引用中的列表
    >   - 嵌套列表
    ```
    - ❌ AI 识别速度：慢
    - ⚠️ 用途：复杂说明
    - ⚠️ 建议：简化结构

### 📌 llms.txt 推荐标签组合

基于 `llms.full.txt` 的最佳实践：

```markdown
# 项目名称 (H1)

> 项目简介 (引用块)

## 规则优先级 (H2)

1. 规则1 (有序列表)
2. 规则2

-------------------------------------- (分隔线)

## 强制规则 (FR) (H2)

### FR-01 规则名称 ⭐⭐⭐ (H3 + Emoji)

**规则说明：** (粗体)
- 规则要点1 (无序列表)
- 规则要点2

**示例：** (粗体)
```typescript
// 代码示例 (代码块)
const example = 'value';
```

✅ 正确做法 (Emoji + 文字)
❌ 错误做法

-------------------------------------- (分隔线)

## 参考文档 (H2)

- [文档标题](链接地址): 文档描述 (链接 + 描述)
```

### 🎯 关键建议

1. **优先使用 H1-H3 标题** - AI 识别最快，结构最清晰
2. **使用分隔线区分章节** - 视觉清晰，AI 易于分段
3. **列表保持简洁** - 避免过度嵌套
4. **代码块指定语言** - 提高 AI 理解准确度
5. **Emoji 配合文字** - 增强可读性，但不要过度使用
6. **避免复杂 HTML** - 降低 AI 识别难度
7. **保持一致的格式** - 使用统一的标记风格

### ⚡ 识别速度对比表

| 标签类型 | AI 识别速度 | 推荐程度 | 使用场景 |
|---------|------------|---------|---------|
| H1-H6 标题 | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 文档结构 |
| 分隔线 | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 章节分隔 |
| 列表 | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 规则列举 |
| 代码块 | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 代码示例 |
| 粗体/斜体 | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 关键词 |
| 引用块 | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 说明文字 |
| 链接 | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 文档引用 |
| 表格 | ⚡⚡⚡ | ⭐⭐⭐ | 数据对比 |
| Emoji | ⚡⚡ | ⭐⭐⭐ | 视觉标记 |
| HTML 标签 | ⚡ | ⭐ | 特殊需求 |



## llms.txt 标准格式模版

- [llms.txt 标准格式模版](https://llmstxt.org/#example)
  以下是 llms.txt 文件的一个示例，在此情况下，这是用于“react19_ts”项目的原始文件的一个精简版本（另请参阅完整版本）：

### llms.txt 简单格式模版示例

```md
# react19_ts

> react19_ts 是一个基于 React 19 + TypeScript + Vite 7 构建的现代化企业级后台管理系统框架

## AI 开发规则

- **前提条件**：AI 生成的代码不能影响项目运行、不能破坏项目结构、不能破坏项目功能
- **代码存放**：
  - `src/` 目录：手动编写的项目代码
  - `src_ai/` 目录：AI 生成的实验性代码
- **代码长度规则**：
  - 代码 < 500 行：直接放入 `src/` 目录
  - 代码 ≥ 500 行：先放入 `src_ai/` 目录，与发起人确认后再迁移

## 技术栈约束

- **核心**：React 19.2.x + TypeScript 5.9.x + Vite 7.2.x
- **UI**：Ant Design 6.1.x（禁用其他 UI 框架）
- **状态**：Zustand 5.0.x（禁用 Redux/MobX）
- **路由**：React Router 7.12.x
- **国际化**：i18next 25.7.x + react-i18next 16.5.x
- **样式**：SCSS 1.97.x + TailwindCSS 4.1.x

## 核心文档

- [项目 README](../../README.md): 项目完整介绍、技术栈、快速开始
- [开发规范](../../docs/项目开发规范/React%20企业级项目设计规范.md): 代码组织、命名规范
- [需求文档](../../docs/项目需求/React%20企业级项目需求文档.md): 功能需求说明
- [主题开发](../../docs/项目需求/React%20主题色开发说明.md): 主题系统、CSS 变量
- [国际化](../../docs/项目需求/React%20i18n国际化语言包开发说明.md): i18n 架构、命名空间
- [布局系统](../../docs/项目需求/React%20layout布局模式开发说明.md): 三种布局模式设计

## 外部参考

- [React 官方文档](https://react.dev/): React 19 新特性、Hooks、API
- [Ant Design 文档](https://ant.design/): 组件库完整文档
- [Zustand 文档](https://docs.pmnd.rs/zustand): 状态管理库
- [Vite 文档](https://vitejs.dev/): 构建工具配置
```

### llms.txt 完整格式模版示例

```md
# react19_ts

> react19_ts 是一个基于 React 19 + TypeScript + Vite 7 构建的现代化企业级后台管理系统框架。它集成了 Ant Design、Zustand、React Router、i18next 等主流技术栈，提供完整的布局系统、主题切换、国际化、权限管理等企业级功能。

## 开发规则与约束

### 代码组织规则

- 本规则的前提是：AI 生成的代码不能影响项目运行，不能破坏项目结构，不能破坏项目功能
- 当前项目的 `src/` 目录与 `src_ai/` 目录是并列的，`src_ai/` 目录下的文件是 AI 生成的代码，`src/` 目录下的文件是手动编写的代码
- 当 AI 代码超过 500 行时，需要与发起人进行确认，在不影响项目运行的情况下，确认是否将代码放置在 `src_ai/` 目录下
- 当 AI 代码小于 500 行时，可以将代码放置在 `src/` 目录下，保持发起者本意

### 技术栈约束

- 使用 React 19.2.x + TypeScript 5.9.x + Vite 7.2.x 作为核心技术栈
- UI 组件库使用 Ant Design 6.1.x，不要使用其他 UI 框架
- 状态管理使用 Zustand 5.0.x，不要使用 Redux 或 MobX
- 路由管理使用 React Router 7.12.x
- 国际化使用 i18next 25.7.x + react-i18next 16.5.x
- HTTP 请求使用 Axios 1.13.x
- 样式方案支持 SCSS 1.97.x 和 TailwindCSS 4.1.x

### 命名规范

- 目录命名：使用 kebab-case（例如：`user-management/`）
- 页面入口：统一使用 `index.tsx`
- 组件文件：统一使用 `index.tsx`
- Hooks 文件：使用 `use-xxx.ts` 格式
- 样式文件：使用 `styles.scss` 或 `styles.module.scss`
- SCSS 变量：业务层使用 `$lee-xxx`，框架层使用 `$lee-layout-xxx`
- CSS 变量：业务层使用 `--lee-xxx`，框架层使用 `--lee-basic-xxx` / `--lee-sidebar-xxx`
- 国际化命名空间：框架层使用 `lee-layout-` 前缀，业务层使用页面/模块名

### 项目结构约定

- 全局通用组件放在 `src/components/`
- 路由级页面放在 `src/pages/`
- 页面私有组件放在对应页面目录下的 `components/` 子目录
- 通用 Hooks 放在 `src/hooks/`
- 页面私有 Hooks 放在对应页面目录下
- API 服务层放在 `src/services/`
- 全局状态管理放在 `src/store/`
- 工具函数放在 `src/utils/`

## 核心文档

### 项目概览

- [README.md](../../README.md): 项目完整介绍，包含技术栈、功能特性、项目结构、快速开始等
- [版本更新日志](../../version-log.md): 项目版本迭代记录

### 开发规范

- [React 企业级项目设计规范](../../docs/项目开发规范/React%20企业级项目设计规范.md): 项目结构设计、代码组织、命名规范等完整开发规范

### 需求文档

- [React 企业级项目需求文档](../../docs/项目需求/React%20企业级项目需求文档.md): 完整的功能需求说明和业务场景描述
- [React 主题色开发说明](../../docs/项目需求/React%20主题色开发说明.md): 主题系统设计、CSS 变量规范、明暗主题切换实现
- [React i18n国际化语言包开发说明](../../docs/项目需求/React%20i18n国际化语言包开发说明.md): 国际化架构、命名空间规范、使用方法
- [React layout布局模式开发说明](../../docs/项目需求/React%20layout布局模式开发说明.md): 三种布局模式（Basic/Sidebar/TopMenu）的设计与实现
- [React 企业级项目版本管理规范](../../docs/项目需求/React%20企业级项目版本管理规范.md): Git 工作流、版本号规范、发布流程

### 设计方案

- [项目设计方案 - ChatGPT 版本](../../docs/项目设计方案/project-chatGPT.md): ChatGPT 生成的项目设计方案
- [项目设计方案 - DeepSeek 版本](../../docs/项目设计方案/project-deepseek.md): DeepSeek 生成的项目设计方案
- [项目设计方案 - 千问 版本](../../docs/项目设计方案/project-qianwen.md): 千问生成的项目设计方案

## 功能模块文档

### 登录系统

- [登录页面开发文档](../../2-1%20登录页面开发.md): 登录页面的开发思想、功能清单、完整代码备份

## 技术栈参考

### React 生态

- [React 官方文档](https://react.dev/): React 19 官方文档，包含新特性、API 参考、Hooks 使用指南
- [React Router 文档](https://reactrouter.com/): React Router v7 官方文档，路由配置、导航、数据加载
- [TypeScript 官方文档](https://www.typescriptlang.org/): TypeScript 类型系统、配置选项、最佳实践

### UI 框架

- [Ant Design 官方文档](https://ant.design/): Ant Design 6.x 组件库完整文档
- [Ant Design Icons](https://ant.design/components/icon-cn): Ant Design 图标库使用指南
- [TailwindCSS 文档](https://tailwindcss.com/): TailwindCSS 4.x 原子化 CSS 框架文档

### 状态管理与工具

- [Zustand 文档](https://docs.pmnd.rs/zustand): Zustand 状态管理库官方文档
- [i18next 文档](https://www.i18next.com/): i18next 国际化解决方案文档
- [react-i18next 文档](https://react.i18next.com/): React i18next 集成文档
- [Axios 文档](https://axios-http.com/): Axios HTTP 客户端文档

### 构建工具

- [Vite 官方文档](https://vitejs.dev/): Vite 7.x 构建工具配置、插件、优化
- [ESLint 文档](https://eslint.org/): ESLint 代码检查工具配置
- [Prettier 文档](https://prettier.io/): Prettier 代码格式化工具配置

### 专业库

- [LogicFlow 文档](https://site.logic-flow.cn/): LogicFlow 流程图编辑器文档
- [NProgress 文档](https://ricostacruz.com/nprogress/): NProgress 进度条库使用说明
- [crypto-js 文档](https://cryptojs.gitbook.io/docs/): crypto-js 加密库 API 参考
- [lodash 文档](https://lodash.com/): lodash 工具函数库完整参考

## 配置文件说明

### 环境配置

- `.env.development`: 开发环境变量配置（端口、API 地址、代理配置等）
- `.env.production`: 生产环境变量配置
- `.env.mock`: Mock 环境变量配置
- `.env.preview`: 预览环境变量配置

### 构建配置

- `vite.config.ts`: Vite 构建配置（插件、别名、代理、构建优化等）
- `tsconfig.json`: TypeScript 编译配置
- `tsconfig.app.json`: 应用 TypeScript 配置
- `tsconfig.node.json`: Node.js TypeScript 配置

### 代码规范配置

- `eslint.config.js`: ESLint Flat Config 配置
- `.eslintrc.cjs`: ESLint 传统配置
- `.prettierrc`: Prettier 格式化规则
- `.prettierignore`: Prettier 忽略文件配置
- `.stylelintrc.cjs`: Stylelint CSS 检查配置
- `.editorconfig`: 编辑器统一配置

### 样式配置

- `tailwind.config.js`: TailwindCSS 配置（主题、插件、内容路径等）
- `postcss.config.js`: PostCSS 配置

## 开发示例

### 创建新页面

1. 在 `src/pages/` 下创建页面目录（kebab-case）
2. 创建 `index.tsx` 作为页面入口
3. 如需样式，创建 `styles.scss`
4. 如需类型定义，创建 `types.ts`
5. 在 `src/router/routes.ts` 中添加路由配置
6. 在国际化文件中添加对应的翻译

### 创建全局组件

1. 在 `src/components/` 下创建组件目录（kebab-case）
2. 创建 `index.tsx` 作为组件入口
3. 如需样式，创建 `styles.scss` 或 `styles.module.scss`
4. 如需类型定义，创建 `types.ts`
5. 导出组件供其他模块使用

### 添加 API 服务

1. 在 `src/services/` 下创建服务文件（例如：`user.ts`）
2. 使用 `src/utils/request.ts` 中封装的 axios 实例
3. 定义请求参数和响应类型
4. 导出 API 函数供页面或 Hooks 调用

### 创建全局状态

1. 在 `src/store/` 下创建 store 文件（例如：`user.ts`）
2. 使用 Zustand 的 `create` 函数创建 store
3. 使用 `persist` 中间件实现状态持久化（可选）
4. 导出 store hook 供组件使用

## 常见问题

### 路径别名

- 使用 `@/` 作为 `src/` 目录的别名
- 例如：`import { request } from '@/utils/request'`

### 样式导入

- 全局样式变量已通过 Vite 配置自动注入，无需手动导入
- 在 SCSS 文件中可直接使用 `$lee-xxx` 变量

### 国际化使用

- 使用 `useTranslation()` Hook 获取 `t` 函数
- 调用 `t('namespace.key')` 获取翻译文本
- 框架层使用 `lee-layout-` 命名空间，业务层使用页面名作为命名空间

### 主题切换

- 使用 `useTheme()` Hook 获取当前主题和切换函数
- 主题值为 `'light'` 或 `'dark'`
- 主题切换会自动更新 `data-theme` 属性和 CSS 变量

### 布局切换

- 使用 `useLayoutStore()` 获取布局状态和切换函数
- 布局模式：`'basic'` / `'sidebar'` / `'top-menu'`
- 布局配置会自动持久化到 localStorage
```
