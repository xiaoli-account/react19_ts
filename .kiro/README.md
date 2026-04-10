# Kiro 项目配置

此目录包含 Kiro 的项目级配置。

## 目录结构

```
.kiro/
  ├── settings/
  │   └── mcp.json          # MCP 服务器配置
  ├── prompts/              # 提示词配置（可选）
  ├── agents/               # 自定义代理配置（可选）
  ├── steering/             # Steering 文件（项目知识库）
  │   ├── project-overview.md
  │   └── README.md
  └── README.md             # 本文件
```

## 配置说明

### Steering 文件（项目知识库）

Steering 文件存放在 `steering/` 目录，提供项目上下文和开发规范：
- `project-overview.md` - 项目概述、技术栈、代码规范

### MCP 服务器配置

MCP 服务器配置在 `settings/mcp.json` 中：
- 用于配置 Model Context Protocol 服务器
- 支持 Agent、Project、Global 三个作用域

### 配置优先级

当配置冲突时，优先级顺序为：**Agent > Project > Global**

## 更多信息

- [Kiro 配置文档](https://kiro.dev/docs/cli/chat/configuration/)
- [Kiro Steering 文档](https://kiro.dev/docs/cli/steering/)
- [Kiro MCP 文档](https://kiro.dev/docs/cli/mcp/)
