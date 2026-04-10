# Kiro AI 工具配置指南

## 📖 工具介绍

Kiro 是轻量级的 AI 代码助手，专注于提供快速、高效的代码补全和建议。

### 核心特性

- ✅ **轻量快速**: 低资源占用，快速响应
- ✅ **智能补全**: 上下文感知的代码补全
- ✅ **离线模式**: 支持本地模型
- ✅ **多语言支持**: 支持主流编程语言
- ✅ **简单配置**: 最小化配置，开箱即用

## 🔧 llms.txt 配置方法

### 1. 创建配置文件

```bash
touch llms.txt
touch .kiro.yaml
```

### 2. 配置 llms.txt

```txt
# react19_ts

> React 19 + TypeScript 项目

## 技术栈
- React 19.2.x
- TypeScript 5.9.x
- Ant Design 6.1.x

## 路径别名
- @/ → src/
- @AI/@ai → src_ai/

## 代码规范
- 使用 TypeScript
- 遵循 ESLint 规则
- 函数式组件 + Hooks
```

### 3. Kiro 配置文件

```yaml
# .kiro.yaml
project:
  name: react19_ts
  language: typescript
  framework: react

knowledge:
  llms_file: llms.txt

completion:
  enabled: true
  trigger: auto
  delay: 100ms

model:
  type: local # 或 remote
  name: codellama
```

## 💡 使用技巧

### 1. 快捷键

| 快捷键  | 功能       |
| ------- | ---------- |
| `Tab`   | 接受建议   |
| `Esc`   | 取消建议   |
| `Alt+]` | 下一个建议 |
| `Alt+[` | 上一个建议 |

### 2. 代码补全

```typescript
// 输入函数名，Kiro 自动补全
const fetchUser = async (id: string) => {
  // Kiro 会建议完整的函数实现
};
```

### 3. 离线模式

```yaml
# .kiro.yaml
model:
  type: local
  path: ~/.kiro/models/codellama
  cache: true
```

## ❓ 常见问题

### Q1: Kiro 如何读取项目配置？

**A**: Kiro 读取 `llms.txt` 和 `.kiro.yaml` 文件。

### Q2: 如何提高补全速度？

**A**:

1. 使用本地模型
2. 启用缓存
3. 减少 delay 时间

### Q3: Kiro 支持哪些模型？

**A**:

- CodeLlama (本地)
- StarCoder (本地)
- GPT-3.5 (远程)
- Claude (远程)

## 🔗 相关资源

- [Kiro 官方文档](https://kiro.dev)
- [本地模型下载](https://kiro.dev/models)
- [项目知识库](../lee-custom-llms-text/llms.txt)

---

**最后更新**: 2026-01-22
