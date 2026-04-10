# Windsurf AI 编辑器配置指南

## 📖 工具介绍

Windsurf 是新一代 AI 编程助手，支持多模型切换，提供智能代码补全、项目理解和上下文感知的代码生成能力。

### 核心特性

- ✅ **多模型支持**: 支持 GPT-4、Claude、Gemini 等多种模型
- ✅ **项目理解**: 深度理解项目结构和代码关系
- ✅ **上下文感知**: 基于整个项目上下文生成代码
- ✅ **智能补全**: 实时代码补全和建议
- ✅ **知识库集成**: 支持 llms.txt 标准

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

在项目根目录创建 `llms.txt` 文件：

```bash
touch llms.txt
```

### 2. 配置项目知识库

#### 基础配置

```txt
# react19_ts

> React 19 + TypeScript + Vite 7 企业级后台管理系统

## 技术栈
- React 19.2.x + TypeScript 5.9.x + Vite 7.2.x
- UI: Ant Design 6.1.x
- 状态: Zustand 5.0.x
- 路由: React Router 7.12.x
- 国际化: i18next 25.7.x

## 路径别名
- @/ → src/
- @AI/@ai → src_ai/

## 开发规则
- 代码 < 500 行 → src/
- 代码 ≥ 500 行 → src_ai/
- 遵循 ESLint + Prettier 规范

## 文档
- [开发规范](./docs/项目开发规范/React%20企业级项目设计规范.md)
- [完整知识库](./src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt)
```

### 3. Windsurf 项目配置

创建 `.windsurf/config.json`：

```json
{
  "knowledgeBase": {
    "llmsFile": "llms.txt",
    "additionalFiles": [
      "src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt",
      "README.md",
      "docs/项目开发规范/React 企业级项目设计规范.md"
    ]
  },
  "codeStyle": {
    "typescript": true,
    "eslint": true,
    "prettier": true
  },
  "aiModel": {
    "default": "gpt-4",
    "fallback": "claude-3-sonnet"
  }
}
```

## 💡 使用技巧

### 1. 快捷键

| 快捷键                 | 功能     | 说明               |
| ---------------------- | -------- | ------------------ |
| `Cmd/Ctrl + Shift + P` | 命令面板 | 打开 Windsurf 命令 |
| `Cmd/Ctrl + .`         | AI 建议  | 获取 AI 代码建议   |
| `Alt + Enter`          | 快速修复 | AI 辅助修复问题    |
| `Cmd/Ctrl + Shift + A` | AI 对话  | 打开 AI 对话窗口   |

### 2. 项目理解功能

#### 索引项目

```bash
# Windsurf 会自动索引项目
# 手动触发：Cmd+Shift+P → "Windsurf: Index Project"
```

#### 查询项目结构

```
Prompt:
@project 这个项目的布局系统是如何实现的？
```

#### 查找相关代码

```
Prompt:
@find 所有使用 Zustand 的状态管理文件
```

### 3. 代码生成最佳实践

#### 生成组件

```
Prompt:
创建一个用户管理页面
- 位置：src_ai/pages/user-management/
- 使用 Ant Design Table
- 集成 @/services/user.ts 的 API
- 支持 CRUD 操作
- 遵循 @llms.txt 规范
```

#### 生成 Hook

```
Prompt:
创建一个数据获取 Hook
- 文件：src/hooks/use-fetch-data.ts
- 支持分页、搜索、排序
- 错误处理和加载状态
- TypeScript 类型定义
```

### 4. 多模型切换

```bash
# 在对话中切换模型
/model gpt-4          # 切换到 GPT-4
/model claude-3       # 切换到 Claude 3
/model gemini-pro     # 切换到 Gemini Pro

# 针对不同任务使用不同模型
- 代码生成：GPT-4
- 代码解释：Claude 3
- 快速补全：GPT-3.5-turbo
```

### 5. 上下文管理

#### 添加上下文文件

```
Prompt:
@src/components/UserCard/index.tsx
@src/types/user.ts
基于这两个文件创建 ProductCard 组件
```

#### 使用项目知识库

```
Prompt:
@llms.txt 请遵循项目规范创建新的 API 服务
```

## ❓ 常见问题

### Q1: Windsurf 如何读取 llms.txt？

**A**: Windsurf 会自动读取项目根目录的 `llms.txt` 文件。可以在 `.windsurf/config.json` 中配置额外的知识库文件。

### Q2: 如何提高代码生成质量？

**A**:

1. **详细的 llms.txt**: 提供完整的项目规范和约束
2. **引用示例代码**: 使用 `@file` 引用现有代码
3. **明确需求**: 提供详细的功能描述和技术要求
4. **分步生成**: 复杂功能分多次生成，逐步完善

### Q3: Windsurf 支持哪些 AI 模型？

**A**:

- **GPT 系列**: GPT-4, GPT-4-turbo, GPT-3.5-turbo
- **Claude 系列**: Claude 3 Opus, Claude 3 Sonnet
- **Gemini 系列**: Gemini Pro, Gemini Ultra
- **自定义模型**: 支持 OpenAI 兼容的 API

### Q4: 如何配置代码风格？

**A**: 在 `.windsurf/config.json` 中配置：

```json
{
  "codeStyle": {
    "indentSize": 2,
    "quotes": "single",
    "semi": true,
    "trailingComma": "es5",
    "typescript": true
  }
}
```

### Q5: Windsurf 生成的代码如何管理？

**A**: 遵循项目规则：

- < 500 行 → `src/` 目录
- ≥ 500 行 → `src_ai/` 目录
- 使用 `@AI` 或 `@ai` 别名引用

### Q6: 如何处理大型项目？

**A**:

1. **分模块索引**: 只索引当前工作的模块
2. **使用 .windsurfignore**: 排除不需要的文件
3. **定期清理缓存**: `Cmd+Shift+P → "Windsurf: Clear Cache"`

```txt
# .windsurfignore
node_modules/
dist/
build/
.git/
*.log
```

### Q7: 如何集成团队知识库？

**A**:

1. 创建团队共享的 `llms.txt`
2. 在 `.windsurf/config.json` 中引用
3. 使用 Git 管理知识库文件
4. 定期更新和同步

```json
{
  "knowledgeBase": {
    "llmsFile": "llms.txt",
    "teamKnowledge": [
      "docs/team-standards.md",
      "docs/api-guidelines.md",
      "docs/component-library.md"
    ]
  }
}
```

## 🔗 相关资源

- [Windsurf 官方文档](https://windsurf.ai/docs)
- [llms.txt 标准](https://llmstxt.org/)
- [项目知识库](../lee-custom-llms-text/llms.full.txt)
- [项目开发规范](../../../docs/项目开发规范/React%20企业级项目设计规范.md)

---

**最后更新**: 2026-01-22
