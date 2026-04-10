# 🤖 AI 代码目录

本目录是项目的正式组成部分，用于存放 AI 生成的代码，与 `src/` 目录共同构成完整的项目。

## 📋 目录定位

### 核心理念

`src_ai/` 是项目不可分割的一部分，**不是临时目录或中间件**，而是与 `src/` 并列的正式代码目录。

### 主要作用

- ✅ **代码分类管理**: 区分 AI 生成的代码与手动编写的代码
- ✅ **项目组成部分**: 作为 `src/` 的补充，共同构成完整项目
- ✅ **直接调用**: `src/` 可直接调用 `src_ai/` 中的代码
- ✅ **知识库管理**: 存放 AI 工具所需的项目知识库文档

### 代码存放规则

| 代码行数 | 存放位置  | 说明                                     |
| -------- | --------- | ---------------------------------------- |
| < 500 行 | `src/`    | 小型代码放入主目录                       |
| ≥ 500 行 | `src_ai/` | 大型代码放入 AI 目录，作为 `src/` 的补充 |

> **重要**: `src_ai/` 中的代码是正式项目代码，可直接在生产环境使用，无需迁移到 `src/`。

## 📁 目录结构

```
src_ai/
├── readme.md              # 本说明文档
├── ai-knowledge/          # AI 知识库（llms.txt 等）
│   ├── llms.txt.md        # llms.txt 标准说明
│   ├── lee-custom-llms-text/    # 项目自定义知识库
│   │   ├── llms.txt             # 简洁版
│   │   └── llms.full.txt        # 完整版
│   └── ant-design-llms-text/    # Ant Design 知识库
│       ├── readme.md            # 知识库说明
│       ├── llms.txt             # 组件概览
│       └── llms-full.txt        # 完整文档
├── components/            # AI 生成的组件（正式代码）
├── pages/                 # AI 生成的页面（正式代码）
├── assets/                # AI 生成的资源文件
└── test/                  # AI 生成的测试代码
```

## 🎯 使用场景

### 1. AI 辅助开发

```bash
# AI 生成大型组件（≥500 行）
src_ai/components/data-visualization/

# AI 生成复杂页面（≥500 行）
src_ai/pages/analytics-dashboard/

# AI 生成工具库
src_ai/utils/chart-helpers.ts
```

### 2. 代码调用示例

#### 从 src 调用 src_ai 中的组件

```tsx
// src/pages/dashboard/index.tsx
import { DataVisualization } from '@AI/components/data-visualization';
// 或使用小写别名
// import { DataVisualization } from '@ai/components/data-visualization';

const Dashboard = () => {
  return (
    <div>
      <DataVisualization data={chartData} />
    </div>
  );
};
```

#### 从 src_ai 调用 src 中的工具

```tsx
// src_ai/components/complex-table/index.tsx
import { request } from '@/utils/request';
import { formatDate } from '@/utils/format';

// AI 生成的组件可以使用 src 中的工具
```

#### src_ai 内部相互调用

```tsx
// src_ai/pages/analytics/index.tsx
import { ChartComponent } from '@AI/components/chart';
import { DataProcessor } from '@ai/utils/data-processor';

// src_ai 内部也使用 @AI 或 @ai 别名
```

### 3. 知识库维护

- 更新项目规范 → 修改 `ai-knowledge/lee-custom-llms-text/`
- 添加新的依赖文档 → 在 `ai-knowledge/` 下创建新目录

## 💡 最佳实践

### ✅ 推荐做法

- **大型功能**: 将 ≥500 行的 AI 代码直接放入 `src_ai/`
- **模块化**: 保持 `src_ai/` 中代码的独立性和可复用性
- **文档同步**: 在 `src_ai/` 中添加新功能时，更新对应的 README
- **类型定义**: 为 `src_ai/` 中的代码提供完整的 TypeScript 类型
- **测试覆盖**: 为 `src_ai/` 中的代码编写测试用例

### ❌ 避免做法

- ~~不要将 `src_ai/` 视为临时目录~~
- ~~不要认为 `src_ai/` 的代码需要迁移到 `src/`~~
- ~~不要在 `src_ai/` 中存放敏感信息~~
- ~~不要忽略 `src_ai/` 代码的质量要求~~

## 🔄 项目架构

### 双目录协作模式

```
项目根目录
├── src/                   # 主目录（手动编写的代码）
│   ├── components/        # 手动编写的组件
│   ├── pages/             # 手动编写的页面
│   ├── utils/             # 通用工具函数
│   └── ...
│
├── docs/                  # 文档目录
│   └── ai_docs/          # AI 生成的文档目录
├── src_ai/                # AI 目录（AI 生成的代码）
│   ├── components/        # AI 生成的组件
│   ├── pages/             # AI 生成的页面
│   ├── ai-knowledge/      # AI 知识库
│   └── ...
│
└── 两个目录可以相互调用，共同构成完整项目
```

### 调用关系

```
┌─────────────────────────────────────────────┐
│              完整项目                        │
│  ┌─────────────┐      ┌─────────────┐      │
│  │    src/     │ ←──→ │   src_ai/   │      │
│  │  主目录     │      │  AI 目录    │      │
│  │  手动代码   │      │  AI 代码    │      │
│  └─────────────┘      └─────────────┘      │
│         ↓                     ↓             │
│    生产环境部署         生产环境部署         │
└─────────────────────────────────────────────┘
```

## 📚 相关文档

- [AI 知识库说明](./ai-knowledge/readme.md)
- [llms.txt 标准文档](./ai-knowledge/llms.txt.md)
- [AI 规则索引文档](../docs/ai_docs/guide/llms-rules-index.md)
- [项目开发规范](../docs/项目开发规范/React%20企业级项目设计规范.md)
- [项目 README](../README.md)

## ⚠️ 注意事项

### 代码质量要求

`src_ai/` 中的代码与 `src/` 中的代码具有**相同的质量要求**：

1. **类型安全**: 完整的 TypeScript 类型定义
2. **代码规范**: 遵循 ESLint 和 Prettier 规范
3. **样式规范**: 符合项目的 SCSS/TailwindCSS 规范
4. **国际化**: 支持多语言的功能需添加 i18n 配置
5. **测试覆盖**: 关键功能需要编写测试用例
6. **文档完善**: 复杂功能需要添加使用说明

### 依赖管理

- 确保 AI 代码使用的依赖已在 `package.json` 中声明
- 避免在 `src_ai/` 中引入项目未使用的新依赖
- 保持与 `src/` 相同的技术栈约束

### 版本控制

- `src_ai/` 中的代码需要提交到 Git 仓库
- 遵循相同的 Git 工作流和分支策略
- 代码审查流程与 `src/` 保持一致

---

**最后更新**: 2026-01-22
