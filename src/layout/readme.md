# 项目框架 Layout 布局目录

此文档对项目框架 layout 布局目录进行说明。本目录包含多模式布局系统，支持基础布局、侧边栏布局、顶部菜单布局和 PLM 布局等多种布局模式。

## 目录结构

```bash
src/layout/
├── api-connection/           # API 连接相关逻辑
├── components/               # 布局共享组件
│   ├── Lee-Access/          # 权限控制组件
│   ├── Lee-Button/          # 按钮组件
│   ├── Lee-Upload/          # 上传组件
│   └── System-Switcher/     # 系统切换组件
├── constants/               # 布局常量定义
├── hooks/                   # 布局相关自定义 Hooks
├── i18n/                    # 国际化配置
│   ├── zh-CN/              # 中文配置
│   └── en-US/              # 英文配置
├── lee-basic-layout/        # 基础布局模式
│   ├── breadcrumb/         # 面包屑组件
│   ├── header/             # 头部组件
│   ├── menu-collapse-btn/  # 菜单折叠按钮
│   ├── sidebar/            # 侧边栏组件
│   ├── styles/             # 布局样式文件
│   └── tab/                # 标签页组件
├── lee-plm-layout/          # PLM 布局模式
├── lee-sidebar-layout/      # 侧边栏布局模式
├── lee-top-menu-layout/     # 顶部菜单布局模式
├── router/                  # 布局路由配置
├── stores/                  # 布局状态管理
├── themes/                  # 主题配置
├── types/                   # 类型定义
├── utils/                   # 工具函数
├── index.tsx               # 布局管理器入口
└── main.ts                 # 统一导出入口
```

## 使用说明

### 1. 布局管理器

`index.tsx` 是布局系统的入口，根据 `layoutMode` 动态渲染对应的布局组件：

- `lee-basic` - 基础布局（默认）
- `lee-sidebar` - 侧边栏布局
- `lee-top-menu` - 顶部菜单布局
- `lee-plm` - PLM 专用布局

### 2. 如何切换布局模式

通过 `useLayoutStore` 中的 `setLayoutMode` 方法切换布局：

```tsx
import { useLayoutStore } from '@/layout';

const { setLayoutMode } = useLayoutStore();
setLayoutMode('lee-sidebar');
```

### 3. 导出入口

统一从 `main.ts` 导入布局相关模块：

```tsx
// 导入布局管理器
import { LayoutManager } from '@/layout';

// 导入 store
import { useLayoutStore } from '@/layout';

// 导入 hooks
import { useMenu, useTab } from '@/layout';
```

## 创建日期：2026/04/10