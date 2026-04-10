# Qoder AI 编辑器配置指南

## 📖 工具介绍

Qoder 是专注于代码质量的 AI 编程工具，提供智能代码审查、质量分析和重构建议。

### 核心特性

- ✅ **代码质量分析**: 自动检测代码质量问题
- ✅ **智能审查**: AI 驱动的代码审查
- ✅ **重构建议**: 基于最佳实践的重构建议
- ✅ **性能优化**: 识别性能瓶颈
- ✅ **安全扫描**: 检测安全漏洞

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

```bash
# 创建 llms.txt
touch llms.txt

# 创建 Qoder 配置
touch .qoder.json
```

### 2. 配置 llms.txt

```txt
# react19_ts

> React 19 + TypeScript 企业级项目

## 技术栈
- React 19.2.x + TypeScript 5.9.x
- Ant Design 6.1.x
- Zustand 5.0.x

## 代码质量标准
- TypeScript strict mode
- ESLint + Prettier
- 测试覆盖率 > 80%
- 代码复杂度 < 10

## 路径别名
- @/ → src/
- @AI/@ai → src_ai/

## 文档
- [开发规范](./docs/项目开发规范/React%20企业级项目设计规范.md)
```

### 3. Qoder 配置文件

```json
{
  "knowledgeBase": "llms.txt",
  "codeQuality": {
    "complexity": {
      "max": 10,
      "warn": 7
    },
    "duplication": {
      "threshold": 5
    },
    "coverage": {
      "min": 80
    }
  },
  "review": {
    "autoReview": true,
    "checkSecurity": true,
    "checkPerformance": true,
    "checkAccessibility": true
  }
}
```

## 💡 使用技巧

### 1. 代码审查

```
# 审查单个文件
qoder review src/components/UserCard/index.tsx

# 审查整个目录
qoder review src/pages/

# 审查变更的文件
qoder review --changed
```

### 2. 质量分析

```
# 生成质量报告
qoder analyze --report

# 检查代码复杂度
qoder complexity src/

# 检查重复代码
qoder duplication
```

### 3. 重构建议

```
# 获取重构建议
qoder refactor src/utils/helper.ts

# 自动重构
qoder refactor --auto src/components/
```

## ❓ 常见问题

### Q1: Qoder 如何读取项目规范？

**A**: Qoder 读取 `llms.txt` 和 `.qoder.json` 来理解项目的代码质量标准。

### Q2: 如何自定义代码质量规则？

**A**: 在 `.qoder.json` 中配置自定义规则：

```json
{
  "rules": {
    "max-lines": 500,
    "max-params": 4,
    "max-depth": 4,
    "no-console": "error"
  }
}
```

### Q3: Qoder 支持哪些语言？

**A**:

- TypeScript/JavaScript
- React/Vue/Angular
- Python
- Java
- Go

## 🔗 相关资源

- [Qoder 官方文档](https://qoder.dev/docs)
- [代码质量标准](https://qoder.dev/standards)
- [项目知识库](../lee-custom-llms-text/llms.full.txt)

---

**最后更新**: 2026-01-22
