# Antigravity AI Project Rules

## 📌 会话初始化协议 (Session Initialization)
每次开启新会话，AI **必须立即读取**以下核心规则库以确保行为一致性：
1. **主规则库**: `src_ai/ai-knowledge/lee-custom-llms-text/llms.txt`
2. **完整规范**: `src_ai/ai-knowledge/lee-custom-llms-text/llms.full.txt`

**优先级：** llms.txt 规则 > 用户需求 > AI 主观判断。

---

## 🎯 项目核心信息 (Project Core)
- **项目名称**: react19_ts
- **核心技术栈**: React 19.2.x, TypeScript 5.9.x, Vite 7.2.x
- **UI & 状态**: Ant Design 6.1.x, Zustand 5.0.x, React Router 7.12.x
- **路径别名**:
  - `@` -> `./src`
  - `@AI` / `@ai` -> `./src_ai`

---

## ⚠️ 强制代码规范 (Mandatory Standards)

### 1. 代码存放规则 (FR-06)
- **独立功能** OR **代码 ≥ 500 行** -> 必须存放在 `src_ai/`（严禁放在 `src/`）
- **非独立功能** AND **代码 < 500 行** -> 可存放在 `src/`
- **测试代码** -> 必须存放在 `src_ai/test/`

### 2. 生成前自检
在生成或修改代码前，必须：
1. 确认技术栈版本符合上述要求。
2. 预估代码行数以决定存放目录。
3. 检查是否需要更新国际化或样式变量。

---

## 📖 参考资源
- [项目开发规范](docs/项目开发规范/React%20企业级项目设计规范.md)
- [项目需求文档](docs/项目需求/React%20企业级项目需求文档.md)

---
*注：本文件已整合原 `.antigravity/` 和 `.agent/rules/` 下的所有配置，作为本项目唯一的 AI 引导入口。*
