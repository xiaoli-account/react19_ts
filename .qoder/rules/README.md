# Qoder Rules 目录

此目录包含 Qoder 的项目级规则文件。

## 文件说明

- `project-standards.md` - 项目标准规则（代码组织、技术栈、命名规范等）

## 规则类型

Qoder 支持四种规则类型：

1. **Always Apply** - 应用于所有 AI Chat 和 Inline Chat 请求
2. **Model Decision** - AI 根据规则描述在 Agent 模式下决定何时应用
3. **Specific Files** - 应用于匹配通配符模式的所有文件
4. **Apply Manually** - 通过 `@rule` 手动应用

## 规则限制

- 所有活动规则文件总计最多 **100,000 个字符**（超出内容将被截断）
- 仅支持自然语言，不支持图片或链接

## 配置规则

规则需要通过 Qoder UI 进行配置：

1. 打开 Qoder AI Chat 面板
2. 点击右上角下拉菜单 → **Your Settings**
3. 选择 **Rules**
4. 点击 **Add** 添加规则
5. 选择规则类型并关联规则文件

## 更多信息

- [Qoder 规则文档](https://docs.qoder.com/user-guide/rules)
- [Qoder 设置文档](https://docs.qoder.com/plugins/settings)
