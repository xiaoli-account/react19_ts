# VS Code AI 扩展配置指南

## 📖 工具介绍

VS Code 支持多种 AI 扩展，包括 GitHub Copilot、Codeium、Tabnine 等，提供智能代码补全和 AI 辅助编程功能。

### 主流 AI 扩展

- ✅ **GitHub Copilot**: GitHub 官方 AI 编程助手
- ✅ **Codeium**: 免费的 AI 代码补全工具
- ✅ **Tabnine**: 支持本地和云端的 AI 助手
- ✅ **Amazon CodeWhisperer**: AWS 的 AI 编程工具
- ✅ **Continue**: 开源的 AI 编程助手

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

```bash
# 创建 llms.txt
touch llms.txt

# 创建 VS Code 工作区配置
mkdir -p .vscode
touch .vscode/settings.json
```

### 2. 配置 llms.txt

```txt
# react19_ts

> React 19 + TypeScript + Vite 7 企业级项目

## 技术栈
- React 19.2.x + TypeScript 5.9.x
- Ant Design 6.1.x
- Zustand 5.0.x
- React Router 7.12.x

## 路径别名
- @/ → src/
- @AI/@ai → src_ai/

## 代码规范
- TypeScript strict mode
- ESLint + Prettier
- 函数式组件 + Hooks

## 文档
- [开发规范](./docs/项目开发规范/React%20企业级项目设计规范.md)
- [完整知识库](./src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt)
```

### 3. VS Code 配置

#### GitHub Copilot 配置

```json
// .vscode/settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.advanced": {
    "debug.overrideEngine": "gpt-4",
    "debug.testOverrideProxyUrl": "",
    "debug.overrideProxyUrl": ""
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "github.copilot.editor.enableCodeActions": true
}
```

#### Codeium 配置

```json
{
  "codeium.enableConfig": {
    "*": true
  },
  "codeium.enableCodeLens": true,
  "codeium.enableSearch": true,
  "codeium.enableChatMode": true
}
```

#### Continue 配置

```json
// .continue/config.json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4"
    }
  ],
  "contextProviders": [
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {
        "docsUrl": "file://./llms.txt"
      }
    }
  ]
}
```

## 💡 使用技巧

### 1. GitHub Copilot

#### 快捷键

| 快捷键       | 功能              |
| ------------ | ----------------- |
| `Tab`        | 接受建议          |
| `Alt+]`      | 下一个建议        |
| `Alt+[`      | 上一个建议        |
| `Ctrl+Enter` | 打开 Copilot 面板 |

#### 使用注释引导

```typescript
// 创建一个用户列表组件，使用 Ant Design Table
// 支持分页、搜索和排序
// 数据从 @/services/user.ts 获取
export const UserList: React.FC = () => {
  // Copilot 会根据注释生成代码
};
```

### 2. Codeium

#### 聊天模式

```
Cmd/Ctrl + Shift + P → "Codeium: Open Chat"

Prompt:
基于 @llms.txt 创建一个新的页面组件
```

#### 代码解释

```
选中代码 → 右键 → "Codeium: Explain Code"
```

### 3. Continue

#### 配置项目上下文

```json
{
  "contextProviders": [
    {
      "name": "file",
      "params": {
        "files": ["llms.txt", "src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt"]
      }
    }
  ]
}
```

#### 使用 @ 引用

```
@llms.txt 请遵循项目规范创建组件
@src/components/UserCard 基于这个创建 ProductCard
```

## ❓ 常见问题

### Q1: 如何让 AI 扩展读取 llms.txt？

**A**: 不同扩展的方法：

- **GitHub Copilot**: 自动读取项目文件
- **Codeium**: 在聊天中引用 `@llms.txt`
- **Continue**: 在 config.json 中配置 contextProviders

### Q2: 多个 AI 扩展会冲突吗？

**A**: 可能会冲突。建议：

1. 同时只启用一个主要的补全扩展
2. 使用工作区设置分别配置
3. 根据需求切换扩展

```json
{
  "github.copilot.enable": {
    "*": false // 禁用 Copilot
  },
  "codeium.enableConfig": {
    "*": true // 启用 Codeium
  }
}
```

### Q3: 如何提高代码建议质量？

**A**:

1. 编写清晰的注释和函数名
2. 提供完整的类型定义
3. 在 llms.txt 中详细描述项目规范
4. 使用 @ 引用相关文件

### Q4: 如何配置团队统一的 AI 设置？

**A**: 使用工作区配置：

```json
// .vscode/settings.json (提交到 Git)
{
  "github.copilot.enable": {
    "*": true
  },
  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first"
}
```

### Q5: 如何处理敏感信息？

**A**:

1. 在 `.gitignore` 中排除敏感文件
2. 使用 `.vscodeignore` 排除不需要的文件
3. 在扩展设置中配置排除规则

```json
{
  "github.copilot.advanced": {
    "inlineSuggest.enable": true,
    "debug.filterLogCategories": []
  },
  "files.exclude": {
    "**/.env": true,
    "**/*.key": true
  }
}
```

### Q6: 如何在离线环境使用？

**A**:

- **GitHub Copilot**: 需要联网
- **Codeium**: 需要联网
- **Tabnine**: 支持本地模式
- **Continue**: 可配置本地模型

本地模式配置示例：

```json
{
  "models": [
    {
      "title": "Local CodeLlama",
      "provider": "ollama",
      "model": "codellama:7b"
    }
  ]
}
```

## 🔗 相关资源

- [GitHub Copilot 文档](https://docs.github.com/copilot)
- [Codeium 文档](https://codeium.com/docs)
- [Continue 文档](https://continue.dev/docs)
- [Tabnine 文档](https://www.tabnine.com/docs)
- [项目知识库](../lee-custom-llms-text/llms.full.txt)

---

**最后更新**: 2026-01-22
