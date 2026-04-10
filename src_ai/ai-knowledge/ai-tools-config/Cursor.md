# Cursor AI 编辑器配置指南

## 📖 工具介绍

Cursor 是一款基于 AI 的现代代码编辑器，内置 GPT-4、Claude 等大语言模型，提供智能代码补全、代码解释、重构建议等功能。

### 核心特性

- ✅ **AI 代码补全**: 基于上下文的智能代码建议
- ✅ **对话式编程**: 通过自然语言与 AI 交互
- ✅ **代码解释**: AI 解释复杂代码逻辑
- ✅ **智能重构**: AI 辅助代码重构和优化
- ✅ **多模型支持**: GPT-4、Claude、自定义模型

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

在项目根目录创建 `.cursorrules` 文件或使用 `llms.txt`：

```bash
# 方式一：使用 .cursorrules（Cursor 专用）
touch .cursorrules

# 方式二：使用 llms.txt（通用标准）
touch llms.txt
```

### 2. 配置项目知识库

#### 简洁配置（推荐）

```txt
# react19_ts

> 基于 React 19 + TypeScript + Vite 7 的企业级后台管理系统

## 技术栈
- React 19.2.x + TypeScript 5.9.x
- Ant Design 6.1.x
- Zustand 5.0.x
- React Router 7.12.x

## 开发规则
- 代码 < 500 行 → src/
- 代码 ≥ 500 行 → src_ai/
- 使用 @/ 引用 src，@AI/@ai 引用 src_ai

## 核心文档
- [开发规范](./docs/项目开发规范/React%20企业级项目设计规范.md)
- [技术栈文档](./README.md)
```

#### 完整配置（详细版）

```txt
# 使用项目中的完整知识库
参考: src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt
```

### 3. Cursor 特定配置

在 `.cursorrules` 中添加 Cursor 特定规则：

```txt
# Cursor AI Rules for react19_ts

## Code Style
- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Use functional components with Hooks
- Prefer const over let

## Import Rules
- Use @/ for src imports
- Use @AI or @ai for src_ai imports
- Group imports: React → Third-party → Local

## Component Rules
- One component per file
- Use index.tsx as entry point
- Styles in styles.scss
- Types in types.ts

## Naming Conventions
- Directories: kebab-case
- Components: PascalCase
- Hooks: use-xxx.ts
- Utils: camelCase
```

## 💡 使用技巧

### 1. 快捷键

| 快捷键                 | 功能         | 说明                 |
| ---------------------- | ------------ | -------------------- |
| `Cmd/Ctrl + K`         | 打开 AI 对话 | 与 AI 进行对话式编程 |
| `Cmd/Ctrl + L`         | AI 代码生成  | 在当前位置生成代码   |
| `Cmd/Ctrl + I`         | 行内 AI 编辑 | 快速修改当前行       |
| `Cmd/Ctrl + Shift + L` | 解释代码     | AI 解释选中的代码    |

### 2. 对话技巧

#### 精确提问

```
❌ 不好的提问：
"帮我写一个组件"

✅ 好的提问：
"创建一个用户列表组件，使用 Ant Design Table，
支持分页、搜索和排序，数据从 @/services/user.ts 获取"
```

#### 引用上下文

```
# 使用 @ 符号引用文件
@src/components/UserCard/index.tsx
请基于这个组件创建一个类似的 ProductCard 组件

# 引用知识库
@llms.txt 请遵循项目规范创建新页面
```

### 3. 代码生成最佳实践

#### 生成新组件

```
Prompt:
创建一个数据可视化组件 DataChart
- 位置：src_ai/components/data-chart/
- 使用 ECharts 库
- 支持柱状图、折线图、饼图
- 遵循 @llms.txt 中的命名规范
- 添加 TypeScript 类型定义
```

#### 重构代码

```
Prompt:
重构 @src/pages/dashboard/index.tsx
- 提取重复的数据获取逻辑到自定义 Hook
- 优化性能，使用 React.memo
- 添加错误处理
```

### 4. 项目集成工作流

```bash
# 1. 初始化项目配置
创建 .cursorrules 文件
复制 src_ai/ai-knowledge/lee-custom-llms-text/llms.txt

# 2. 开发新功能
使用 Cmd+K 打开 AI 对话
描述需求并引用 @llms.txt

# 3. 代码审查
选中代码 → Cmd+Shift+L → AI 解释和建议

# 4. 重构优化
选中代码 → Cmd+K → 请求重构建议
```

## ❓ 常见问题

### Q1: Cursor 如何读取 llms.txt？

**A**: Cursor 会自动读取项目根目录的以下文件：

- `.cursorrules` (优先级最高)
- `llms.txt`
- `.cursor/rules`

建议使用 `.cursorrules` 作为主配置文件。

### Q2: 如何让 Cursor 理解项目结构？

**A**: 在 `.cursorrules` 中添加项目结构说明：

```txt
## Project Structure
src/          - 手动编写的代码
src_ai/       - AI 生成的代码
  components/ - AI 生成的组件
  pages/      - AI 生成的页面
docs/         - 项目文档
```

### Q3: Cursor 生成的代码不符合项目规范怎么办？

**A**:

1. 检查 `.cursorrules` 是否配置完整
2. 在提问时明确引用规范：`@llms.txt 请遵循项目规范`
3. 使用更具体的提示词，包含技术栈和约束

### Q4: 如何提高 AI 代码质量？

**A**:

- ✅ 提供详细的上下文和需求
- ✅ 引用项目中的示例代码
- ✅ 明确指定技术栈和版本
- ✅ 要求添加类型定义和注释
- ✅ 分步骤生成，逐步完善

### Q5: Cursor 支持哪些 AI 模型？

**A**:

- GPT-4 (默认)
- GPT-3.5-turbo
- Claude 3 Opus
- Claude 3 Sonnet
- 自定义 OpenAI 兼容模型

可在设置中切换模型：`Settings → AI → Model`

### Q6: 如何处理敏感信息？

**A**:

1. 在 `.cursorignore` 中排除敏感文件
2. 不要在 `.cursorrules` 中包含 API 密钥
3. 使用环境变量管理敏感配置

```txt
# .cursorignore
.env
.env.local
*.key
*.pem
```

### Q7: Cursor 生成的代码放在哪里？

**A**: 根据项目规则：

- < 500 行：放入 `src/` 对应目录
- ≥ 500 行：放入 `src_ai/` 对应目录
- 使用 `@AI` 或 `@ai` 别名引用

## 🔗 相关资源

- [Cursor 官方文档](https://cursor.sh/docs)
- [Cursor 快捷键参考](https://cursor.sh/shortcuts)
- [项目 llms.txt 标准](../llms.txt.md)
- [项目开发规范](../../../docs/项目开发规范/React%20企业级项目设计规范.md)

---

**最后更新**: 2026-01-22
