# Antigravity AI 工具配置指南

## 📖 工具介绍

Antigravity 是由 Google Deepmind 开发的高级 AI 编程助手，专注于提供企业级的代码生成和项目理解能力。

### 核心特性

- ✅ **深度项目理解**: 理解复杂的项目架构和代码关系
- ✅ **企业级代码生成**: 生成符合企业标准的高质量代码
- ✅ **智能重构**: AI 辅助代码重构和优化
- ✅ **安全性优先**: 注重代码安全和最佳实践
- ✅ **团队协作**: 支持团队知识库共享

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

在项目根目录创建 `llms.txt` 和 `.antigravity` 配置：

```bash
# 创建 llms.txt
touch llms.txt

# 创建 Antigravity 配置目录
mkdir -p .antigravity
touch .antigravity/config.yaml
```

### 2. 配置 llms.txt

```txt
# react19_ts

> React 19 + TypeScript + Vite 7 企业级后台管理系统框架

## 项目概述
- 技术栈：React 19.2.x + TypeScript 5.9.x + Vite 7.2.x
- UI 框架：Ant Design 6.1.x
- 状态管理：Zustand 5.0.x
- 路由系统：React Router 7.12.x
- 国际化：i18next 25.7.x + react-i18next 16.5.x

## 代码组织规则
- src/ - 手动编写的项目代码（主目录）
- src_ai/ - AI 生成的代码（辅助目录）
- 代码 < 500 行 → src/
- 代码 ≥ 500 行 → src_ai/

## 路径别名
- @/ → src/
- @AI/@ai → src_ai/

## 开发约束
- 使用 TypeScript strict mode
- 遵循 ESLint + Prettier 规范
- 组件使用函数式 + Hooks
- 样式使用 SCSS + TailwindCSS

## 核心文档
- [完整知识库](./src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt)
- [开发规范](./docs/项目开发规范/React%20企业级项目设计规范.md)
- [API 文档](./README.md)
```

### 3. Antigravity 配置文件

创建 `.antigravity/config.yaml`：

```yaml
project:
  name: react19_ts
  type: web-application
  framework: react
  language: typescript

knowledge_base:
  primary: llms.txt
  additional:
    - src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt
    - README.md
    - docs/项目开发规范/React 企业级项目设计规范.md

code_standards:
  typescript:
    strict: true
    target: ES2022
  eslint:
    enabled: true
    config: .eslintrc.cjs
  prettier:
    enabled: true
    config: .prettierrc

ai_behavior:
  code_generation:
    max_lines: 500
    target_directory: src_ai
    require_types: true
    require_tests: false

  code_review:
    check_security: true
    check_performance: true
    check_best_practices: true

security:
  scan_dependencies: true
  check_vulnerabilities: true
  exclude_sensitive_files:
    - .env
    - .env.local
    - '*.key'
    - '*.pem'
```

## 💡 使用技巧

### 1. 项目上下文配置

#### 设置项目范围

```yaml
# .antigravity/scope.yaml
include:
  - src/**/*.{ts,tsx}
  - src_ai/**/*.{ts,tsx}
  - docs/**/*.md

exclude:
  - node_modules
  - dist
  - build
  - '*.test.{ts,tsx}'
```

#### 配置代码模式

```yaml
# .antigravity/patterns.yaml
patterns:
  component:
    template: src_ai/templates/component.tsx
    naming: PascalCase
    location: src/components/{name}/

  page:
    template: src_ai/templates/page.tsx
    naming: kebab-case
    location: src/pages/{name}/

  hook:
    template: src_ai/templates/hook.ts
    naming: use-{name}.ts
    location: src/hooks/
```

### 2. 快捷命令

| 命令        | 功能     | 说明             |
| ----------- | -------- | ---------------- |
| `/generate` | 生成代码 | 基于描述生成代码 |
| `/refactor` | 重构代码 | AI 辅助重构      |
| `/explain`  | 解释代码 | 详细解释代码逻辑 |
| `/review`   | 代码审查 | 安全和质量审查   |
| `/optimize` | 优化代码 | 性能和结构优化   |

### 3. 代码生成最佳实践

#### 生成企业级组件

```
Prompt:
/generate component UserManagement
- 位置：src_ai/components/user-management/
- 功能：用户列表、搜索、分页、CRUD
- 技术：Ant Design Table + Zustand
- 安全：权限检查、XSS 防护
- 测试：单元测试覆盖
- 文档：JSDoc 注释
```

#### 生成 API 服务

```
Prompt:
/generate service UserService
- 位置：src/services/user.ts
- 接口：CRUD + 批量操作
- 类型：完整的 TypeScript 类型
- 错误处理：统一错误处理
- 拦截器：请求/响应拦截
```

### 4. 代码审查功能

#### 安全审查

```
Prompt:
/review security @src/utils/auth.ts
检查：
- XSS 漏洞
- SQL 注入风险
- 敏感信息泄露
- 加密算法安全性
```

#### 性能审查

```
Prompt:
/review performance @src/pages/dashboard/
检查：
- 组件渲染优化
- 内存泄漏
- 不必要的重渲染
- 代码分割建议
```

### 5. 智能重构

#### 提取自定义 Hook

```
Prompt:
/refactor extract-hook @src/pages/user-list/index.tsx
- 提取数据获取逻辑
- 创建 use-user-list.ts
- 保持类型安全
```

#### 组件拆分

```
Prompt:
/refactor split-component @src/components/Dashboard/index.tsx
- 拆分为多个子组件
- 优化组件职责
- 提高可维护性
```

## ❓ 常见问题

### Q1: Antigravity 如何读取项目配置？

**A**: Antigravity 按以下优先级读取配置：

1. `.antigravity/config.yaml` (最高优先级)
2. `llms.txt`
3. `README.md`
4. 项目根目录的其他文档

### Q2: 如何确保生成的代码安全？

**A**:

1. 在 `config.yaml` 中启用安全检查
2. 使用 `/review security` 命令审查代码
3. 配置敏感文件排除列表
4. 定期运行依赖安全扫描

```yaml
security:
  scan_dependencies: true
  check_vulnerabilities: true
  security_level: high
```

### Q3: Antigravity 支持团队协作吗？

**A**: 是的，支持：

1. 共享 `.antigravity/` 配置目录
2. 团队知识库文件
3. 统一的代码模式和模板
4. 代码审查标准

```yaml
team:
  knowledge_base:
    - docs/team-standards.md
    - docs/coding-guidelines.md
  code_review:
    required_approvers: 2
    auto_review: true
```

### Q4: 如何处理大型代码生成？

**A**:

1. 设置 `max_lines` 限制
2. 分模块生成
3. 使用模板系统
4. 增量生成和验证

```yaml
ai_behavior:
  code_generation:
    max_lines: 500
    split_strategy: modular
    incremental: true
```

### Q5: Antigravity 如何理解项目架构？

**A**:

1. 自动分析项目结构
2. 读取 llms.txt 和配置文件
3. 学习现有代码模式
4. 建立项目知识图谱

可以使用 `/analyze project` 查看理解结果。

### Q6: 如何自定义代码生成模板？

**A**: 在 `.antigravity/templates/` 创建模板：

```tsx
// .antigravity/templates/component.tsx
import React from 'react';
import styles from './styles.scss';

interface {{ComponentName}}Props {
  // TODO: 添加 props 类型
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = (props) => {
  return (
    <div className={styles.root}>
      {/* TODO: 实现组件 */}
    </div>
  );
};
```

### Q7: 如何集成 CI/CD？

**A**:

```yaml
# .antigravity/ci.yaml
ci_integration:
  pre_commit:
    - code_review
    - security_scan
    - type_check

  pre_push:
    - full_review
    - dependency_scan
    - performance_check
```

## 🔗 相关资源

- [Antigravity 官方文档](https://deepmind.google/antigravity)
- [企业级最佳实践](https://deepmind.google/antigravity/best-practices)
- [项目知识库](../lee-custom-llms-text/llms.full.txt)
- [安全指南](https://deepmind.google/antigravity/security)

---

**最后更新**: 2026-01-22
