# Cursor AI Rules - 规则索引

> 基于 React 19 + TypeScript + Vite 7 的企业级后台管理系统

此文件是规则索引，详细的规则已拆分为多个文件，便于管理和维护。

## 规则文件列表

- `project-info.md` - 项目信息和知识库
- `code-standards.md` - 代码规范
- `code-organization.md` - 代码组织规则
- `tech-stack.md` - 技术栈约束
- `naming-conventions.md` - 命名规范
- `component-rules.md` - 组件规则
- `workflow.md` - 开发工作流

## 快速参考

### 核心规则

1. **代码长度决定位置**: < 500 行 → `src/`, ≥ 500 行 → `src_ai/`
2. **技术栈**: Ant Design + Zustand + React Router + i18next
3. **命名规范**: 目录 kebab-case, 组件 PascalCase, Hooks use-xxx.ts
4. **类型安全**: 所有代码必须符合 TypeScript 类型安全要求

### 重要提示

- 生成代码前必须阅读 `src_ai/ai-knowledge/lee-custom-llms-text/llms.txt`
- 遵循项目现有的代码风格和结构
- 确保代码通过 ESLint 和 TypeScript 检查
