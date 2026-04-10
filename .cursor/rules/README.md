# Cursor Rules 目录

此目录用于存放 Cursor AI 的规则配置文件。

## 文件说明

- `project-rules.md` - 规则索引和快速参考
- `project-info.md` - 项目信息和知识库
- `code-standards.md` - 代码规范
- `code-organization.md` - 代码组织规则
- `tech-stack.md` - 技术栈约束
- `naming-conventions.md` - 命名规范
- `component-rules.md` - 组件规则
- `workflow.md` - 开发工作流

## 使用方式

Cursor 会自动读取 `.cursor/rules/` 目录下的所有 `.md` 文件作为规则。

## 规则优先级

1. `.cursor/rules/` 目录中的规则文件（自动加载所有 `.md` 文件）
2. `.cursorrules` 文件（如果存在，已删除）
3. `llms.txt` 文件（如果存在）

## 规则组织

规则已按功能模块拆分为多个文件：
- **项目信息**: 项目基本信息和知识库引用
- **代码规范**: TypeScript、代码风格、导入规则
- **代码组织**: 代码存放位置和目录结构
- **技术栈**: UI 框架、状态管理、路由等约束
- **命名规范**: 目录、组件、Hooks 等命名规则
- **组件规则**: 组件结构和编写规范
- **工作流**: 开发流程和代码审查

## 注意事项

- 规则文件使用 Markdown 格式
- 文件修改后，Cursor 会自动重新加载规则
- 规则已拆分为多个文件，便于管理和维护
- 所有规则文件都会被 Cursor 自动加载
