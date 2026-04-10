const e=`# React 主题色开发说明

> **版本**: v1.0.0  
> **更新时间**: 2026-01-21  
> **适用范围**: React 19 企业级后台管理系统

---

## 📋 目录

- [一、概述](#一概述)
- [二、主题系统架构](#二主题系统架构)
- [三、变量命名规范](#三变量命名规范)
- [四、主题文件结构](#四主题文件结构)
- [五、CSS 变量定义规范](#五css-变量定义规范)
- [六、主题切换实现](#六主题切换实现)
- [七、使用方法](#七使用方法)
- [八、新增主题变量指南](#八新增主题变量指南)
- [九、最佳实践](#九最佳实践)

---

## 一、概述

### 1.1 设计目标

项目采用基于 **CSS 变量** 和 **SCSS** 的现代化主题系统，支持：

| 特性 | 说明 |
|------|------|
| 明暗主题切换 | 支持 light / dark 两种主题 |
| 运行时切换 | 无需刷新页面即可切换主题 |
| 状态持久化 | 用户主题偏好自动保存 |
| 组件级变量 | 每个布局组件有独立的主题变量 |
| 易于扩展 | 可快速添加新的主题变量 |
| 分层设计 | 框架层与业务层变量分离 |

### 1.2 技术方案

| 技术 | 用途 |
|------|------|
| CSS 自定义属性 (CSS Variables) | 定义主题变量 |
| \`data-theme\` 属性 | 控制主题切换 |
| SCSS | 样式组织和变量管理 |
| Zustand | 主题状态管理 |
| localStorage | 主题偏好持久化 |

---

## 二、主题系统架构

### 2.1 架构图

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                     ThemeStore (Zustand)                    │
│  - theme: 'light' | 'dark'                                  │
│  - setTheme(theme)                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              document.documentElement                        │
│              data-theme="light" | "dark"                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CSS Variables                          │
│  :root { ... }              [data-theme='dark'] { ... }     │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│    Layout Components     │    │    Business Pages        │
│  src/layout/             │    │  src/pages/              │
│  (框架层样式)             │    │  (业务层样式)            │
└──────────────────────────┘    └──────────────────────────┘
\`\`\`

### 2.2 分层设计

项目采用 **框架层** 与 **业务层** 分离的主题变量设计：

| 层级 | 目录 | 变量前缀 | 说明 |
|------|------|----------|------|
| 框架层 | \`src/layout/\` | \`$lee-layout-\` | 布局组件使用的变量 |
| 业务层 | \`src/styles/\` | \`$lee-\` | 业务页面使用的变量 |

### 2.3 主题切换流程

\`\`\`text
1. 用户点击主题切换按钮
       │
       ▼
2. 调用 themeStore.setTheme('dark')
       │
       ▼
3. 更新 Zustand 状态
       │
       ▼
4. 设置 document.documentElement.setAttribute('data-theme', 'dark')
       │
       ▼
5. CSS 变量自动切换 ([data-theme='dark'] 选择器生效)
       │
       ▼
6. 页面样式自动更新
       │
       ▼
7. 状态持久化到 localStorage
\`\`\`

---

## 三、变量命名规范

### 3.1 SCSS 变量命名规范

#### 框架层变量 (src/layout/)

框架内置的变量，可被业务页面使用：

\`\`\`scss
// 文件: src/layout/themes/variables.scss
// 命名格式: $lee-layout-{category}-{property}

$lee-layout-font-size-base: 14px;
$lee-layout-border-radius: 4px;
$lee-layout-spacing-sm: 8px;
$lee-layout-spacing-md: 16px;
\`\`\`

#### 业务层变量 (src/styles/)

业务页面专用的变量：

\`\`\`scss
// 文件: src/styles/variables.scss
// 命名格式: $lee-{category}-{property}

$lee-font-size-base: 14px;
$lee-border-radius: 4px;
$lee-spacing-sm: 8px;
$lee-spacing-md: 16px;
\`\`\`

### 3.2 CSS 变量命名规范

CSS 自定义属性用于主题切换：

| 层级 | 变量前缀 | 示例 |
|------|----------|------|
| 框架层 | \`--lee-basic-\` / \`--lee-sidebar-\` / \`--lee-top-menu-\` | \`--lee-basic-header-bg\` |
| 业务层 | \`--lee-\` | \`--lee-primary-color\` |

#### 框架层 CSS 变量

\`\`\`scss
// 布局组件 CSS 变量
// 格式: --lee-{layout}-{component}-{property}

--lee-basic-header-bg: #ffffff;
--lee-basic-sidebar-bg: #ffffff;
--lee-basic-content-bg: #fcfcfc;
--lee-sidebar-menu-selected-bg: #e1ecff;
--lee-top-menu-nav-bg: #001529;
\`\`\`

#### 业务层 CSS 变量

\`\`\`scss
// 业务页面 CSS 变量
// 格式: --lee-{property}

--lee-primary-color: #1677ff;
--lee-success-color: #52c41a;
--lee-warning-color: #faad14;
--lee-error-color: #ff4d4f;
\`\`\`

### 3.3 命名规范对照表

| 类型 | 框架层 | 业务层 |
|------|--------|--------|
| SCSS 变量 | \`$lee-layout-xxx\` | \`$lee-xxx\` |
| CSS 变量 | \`--lee-basic-xxx\` / \`--lee-sidebar-xxx\` | \`--lee-xxx\` |
| 文件位置 | \`src/layout/themes/\` | \`src/styles/\` |

---

## 四、主题文件结构

### 4.1 整体目录结构

\`\`\`text
src/
├── styles/                          # 业务页面样式目录
│   ├── variables.scss               # 业务层 SCSS 变量 ($lee-xxx)
│   ├── global.scss                  # 全局样式
│   ├── mixins.scss                  # SCSS 混入
│   └── reset.scss                   # 样式重置
│
└── layout/                          # 布局组件目录
    ├── themes/                      # 框架层主题变量
    │   ├── index.scss               # 主题样式入口
    │   └── variables.scss           # 框架层 SCSS 变量 ($lee-layout-xxx)
    │
    ├── lee-basic-layout/
    │   └── styles/
    │       └── theme/
    │           ├── index.scss       # 主题入口
    │           ├── common/          # 公共变量
    │           ├── light/           # 亮色主题
    │           │   ├── index.scss
    │           │   ├── color.scss   # 颜色变量
    │           │   ├── size.scss    # 尺寸变量
    │           │   └── other.scss   # 其他变量
    │           └── dark/            # 暗色主题
    │               ├── index.scss
    │               ├── color.scss
    │               ├── size.scss
    │               └── other.scss
    │
    ├── lee-sidebar-layout/
    │   └── styles/theme/...         # 同上结构
    │
    └── lee-top-menu-layout/
        └── styles/theme/...         # 同上结构
\`\`\`

### 4.2 业务层变量文件 (src/styles/variables.scss)

\`\`\`scss
// 业务页面样式变量
// 命名规范: $lee-{category}-{property}

$lee-font-size-base: 14px;
$lee-font-size-sm: 12px;
$lee-font-size-lg: 16px;

$lee-border-radius: 4px;
$lee-border-radius-lg: 8px;

$lee-spacing-xs: 4px;
$lee-spacing-sm: 8px;
$lee-spacing-md: 16px;
$lee-spacing-lg: 24px;

// 浅色主题 CSS 变量
:root {
  --lee-primary-color: #1677ff;
  --lee-success-color: #52c41a;
  --lee-warning-color: #faad14;
  --lee-error-color: #ff4d4f;
}

// 深色主题 CSS 变量
[data-theme='dark'] {
  --lee-primary-color: #177ddc;
  --lee-success-color: #49aa19;
  --lee-warning-color: #d89614;
  --lee-error-color: #dc4446;
}
\`\`\`

### 4.3 框架层变量文件 (src/layout/themes/variables.scss)

\`\`\`scss
/**
 * Lee Layout Themes Variables
 * 为业务页面提供标准的主题变量，仅供参考
 * 根据实际项目需求进行调整，或在项目内的公用styles中进行覆盖
 */

// 命名规范: $lee-layout-{category}-{property}

$lee-layout-font-size-base: 14px;
$lee-layout-font-size-sm: 12px;
$lee-layout-font-size-lg: 16px;

$lee-layout-header-height: 64px;
$lee-layout-sidebar-width: 256px;
$lee-layout-sidebar-collapsed-width: 80px;

$lee-layout-border-radius: 4px;
$lee-layout-border-radius-lg: 8px;

$lee-layout-spacing-xs: 4px;
$lee-layout-spacing-sm: 8px;
$lee-layout-spacing-md: 16px;
$lee-layout-spacing-lg: 24px;
\`\`\`

### 4.4 主题状态管理 (src/layout/stores/themeStore.ts)

\`\`\`typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'light',

      setTheme: theme => {
        set({ theme });
        // 更新 DOM 属性
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'layout-theme-storage',
      partialize: state => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => state => {
        // 页面刷新后，从持久化数据恢复时应用主题
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
\`\`\`

---

## 五、CSS 变量定义规范

### 5.1 亮色主题变量 (light/color.scss)

\`\`\`scss
/**
 * Lee Basic Layout Light Color Variables
 * 基础布局亮色主题颜色变量
 * 命名规范: --lee-{layout}-{component}-{property}
 */
.light-color-theme {
  // =========================
  // 主体色 (--lee-basic)
  // =========================
  --lee-basic-content-bg: #fcfcfc;          // 内容区域背景色
  --lee-basic-sidebar-bg: #fff;              // 侧边栏背景色
  --lee-basic-header-bg: #fff;               // 头部背景色

  // =========================
  // 侧边栏颜色 (--lee-basic-sidebar)
  // =========================
  --lee-basic-sidebar-border-color: #f0f0f0;
  --lee-basic-sidebar-menu-selected-bg: #e1ecff;
  --lee-basic-sidebar-submenu-selected-bg: rgba(0, 0, 0, 0.02);
  --lee-basic-sidebar-menu-selected-text: #ffffff;
  --lee-basic-sidebar-submenu-selected-text: #0084ff;

  // =========================
  // 折叠按钮颜色 (--lee-basic-menu-collapse-btn)
  // =========================
  --lee-basic-menu-collapse-btn-bg: #ffffff;
  --lee-basic-menu-collapse-btn-bg-hover: #f5f5f5;
  --lee-basic-menu-collapse-btn-shadow: rgba(0, 0, 0, 0.15);
  --lee-basic-menu-collapse-btn-hover-shadow: rgba(0, 0, 0, 0.3);
  --lee-basic-menu-collapse-btn-border: #eeeeee;
  --lee-basic-menu-collapse-btn-font: #333333;

  // =========================
  // 头部颜色 (--lee-basic-header)
  // =========================
  --lee-basic-header-border: #f0f0f0;
  --lee-basic-header-shadow: rgba(0, 21, 41, 0.08);

  // =========================
  // 搜索框颜色 (--lee-basic-search)
  // =========================
  --lee-basic-search-bg: #f5f5f5dc;
  --lee-basic-search-border: #dfdfdf;
  --lee-basic-search-border-hover: #1b77e8;

  // =========================
  // 用户菜单颜色 (--lee-basic-user-menu)
  // =========================
  --lee-basic-user-menu-font-color: #333333;
  --lee-basic-user-menu-bg-hover: #f5f5f5;

  // =========================
  // 面包屑颜色 (--lee-basic-breadcrumb)
  // =========================
  --lee-basic-breadcrumb-bg: transparent;
  --lee-basic-breadcrumb-border: transparent;

  // =========================
  // Logo 颜色 (--lee-basic-logo)
  // =========================
  --lee-basic-logo-bg: #61dafb;
  --lee-basic-logo-text: #444444;
}
\`\`\`

### 5.2 暗色主题变量 (dark/color.scss)

\`\`\`scss
/**
 * Lee Basic Layout Dark Color Variables
 * 基础布局暗色主题颜色变量
 * 命名规范: --lee-{layout}-{component}-{property}
 */
.dark-color-theme {
  // =========================
  // 主体色 (--lee-basic)
  // =========================
  --lee-basic-content-bg: #070707;           // 页面内容整体背景（最深）
  --lee-basic-sidebar-bg: #1e1f21;           // 侧边栏背景
  --lee-basic-header-bg: #1e1f21;            // 头部背景

  // =========================
  // 侧边栏颜色 (--lee-basic-sidebar)
  // =========================
  --lee-basic-sidebar-border-color: #444444;
  --lee-basic-sidebar-menu-selected-bg: #434343;
  --lee-basic-sidebar-submenu-selected-bg: rgba(0, 0, 0, 0.02);
  --lee-basic-sidebar-menu-selected-text: #ffffff;
  --lee-basic-sidebar-submenu-selected-text: #3b9efb;

  // =========================
  // 折叠按钮颜色 (--lee-basic-menu-collapse-btn)
  // =========================
  --lee-basic-menu-collapse-btn-bg: #4c4c4c;
  --lee-basic-menu-collapse-btn-bg-hover: #656565;
  --lee-basic-menu-collapse-btn-shadow: rgba(0, 0, 0, 0.45);
  --lee-basic-menu-collapse-btn-hover-shadow: rgba(255, 255, 255, 0.15);
  --lee-basic-menu-collapse-btn-border: #4c4c4c;
  --lee-basic-menu-collapse-btn-font: #dfdfdf;

  // =========================
  // 头部颜色 (--lee-basic-header)
  // =========================
  --lee-basic-header-border: #1f2630;
  --lee-basic-header-shadow: rgba(101, 101, 101, 0.6);

  // =========================
  // 搜索框颜色 (--lee-basic-search)
  // =========================
  --lee-basic-search-bg: rgba(255, 255, 255, 0.06);
  --lee-basic-search-border: #888888;
  --lee-basic-search-border-hover: #3b82f6;

  // =========================
  // 用户菜单颜色 (--lee-basic-user-menu)
  // =========================
  --lee-basic-user-menu-font-color: #e6edf3;
  --lee-basic-user-menu-bg-hover: #333333;

  // =========================
  // 面包屑颜色 (--lee-basic-breadcrumb)
  // =========================
  --lee-basic-breadcrumb-bg: #292929;
  --lee-basic-breadcrumb-border: transparent;

  // =========================
  // Logo 颜色 (--lee-basic-logo)
  // =========================
  --lee-basic-logo-bg: #ffffff;
  --lee-basic-logo-text: #f5f5f5;
}
\`\`\`

### 5.3 主题入口文件 (theme/index.scss)

\`\`\`scss
@use './light/index.scss' as *;
@use './dark/index.scss' as *;

:root {
  // 默认亮色主题变量
  @extend .theme-light;
}

// 暗色主题变量覆盖
[data-theme='dark'] {
  @extend .theme-dark;
}
\`\`\`

---

## 六、主题切换实现

### 6.1 主题 Hook (use-theme.ts)

\`\`\`typescript
import { useThemeStore } from '../stores/themeStore';

export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const isDark = theme === 'dark';
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };
};
\`\`\`

### 6.2 Header 中的主题切换

\`\`\`tsx
import { Switch } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/use-theme';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={checked => setTheme(checked ? 'dark' : 'light')}
      checkedChildren={<BulbOutlined />}
      unCheckedChildren={<BulbOutlined />}
      className="theme-switch"
    />
  );
};
\`\`\`

---

## 七、使用方法

### 7.1 在业务页面中使用 SCSS 变量

\`\`\`scss
// 引入业务层变量
@use '@/styles/variables.scss' as *;

.my-page {
  font-size: $lee-font-size-base;
  padding: $lee-spacing-md;
  border-radius: $lee-border-radius;
}
\`\`\`

### 7.2 在业务页面中使用 CSS 变量

\`\`\`scss
.my-component {
  // 使用业务层 CSS 变量
  color: var(--lee-primary-color);
  background-color: var(--lee-success-color);
  
  // 使用框架层 CSS 变量（跨层引用）
  border: 1px solid var(--lee-basic-header-border);
}
\`\`\`

### 7.3 在布局组件中使用框架层变量

\`\`\`scss
// 引入框架层变量
@use '@/layout/themes/variables.scss' as *;

.layout-header {
  height: $lee-layout-header-height;
  font-size: $lee-layout-font-size-base;
}
\`\`\`

### 7.4 在 React 组件中使用

\`\`\`tsx
import { useTheme } from '@/layout/hooks/use-theme';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <p>是否暗色: {isDark ? '是' : '否'}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
};
\`\`\`

### 7.5 条件渲染不同主题内容

\`\`\`tsx
import { useTheme } from '@/layout/hooks/use-theme';

const Logo = () => {
  const { isDark } = useTheme();
  
  return (
    <img 
      src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} 
      alt="Logo" 
    />
  );
};
\`\`\`

---

## 八、新增主题变量指南

### 8.1 新增业务层变量

1. **在 \`src/styles/variables.scss\` 中添加 SCSS 变量**

\`\`\`scss
// 新增卡片相关变量
$lee-card-padding: 16px;
$lee-card-border-radius: 8px;
\`\`\`

2. **添加 CSS 变量（支持主题切换）**

\`\`\`scss
// 浅色主题
:root {
  --lee-card-bg: #ffffff;
  --lee-card-border: #f0f0f0;
  --lee-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// 深色主题
[data-theme='dark'] {
  --lee-card-bg: #1f1f1f;
  --lee-card-border: #434343;
  --lee-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}
\`\`\`

3. **在组件中使用**

\`\`\`scss
.my-card {
  padding: $lee-card-padding;
  border-radius: $lee-card-border-radius;
  background-color: var(--lee-card-bg);
  border: 1px solid var(--lee-card-border);
  box-shadow: var(--lee-card-shadow);
}
\`\`\`

### 8.2 新增框架层变量

1. **在 \`src/layout/themes/variables.scss\` 中添加 SCSS 变量**

\`\`\`scss
// 新增导航相关变量
$lee-layout-nav-height: 48px;
$lee-layout-nav-item-padding: 0 16px;
\`\`\`

2. **在布局主题文件中添加 CSS 变量**

\`\`\`scss
// light/color.scss
.light-color-theme {
  --lee-basic-nav-bg: #f5f5f5;
  --lee-basic-nav-active-bg: #e1ecff;
}

// dark/color.scss
.dark-color-theme {
  --lee-basic-nav-bg: #2d2d2d;
  --lee-basic-nav-active-bg: #434343;
}
\`\`\`

### 8.3 变量分类建议

| 分类 | 文件 | 变量类型 |
|------|------|----------|
| 颜色变量 | \`color.scss\` | 背景色、边框色、文字色、阴影色 |
| 尺寸变量 | \`size.scss\` | 宽度、高度、间距、圆角 |
| 其他变量 | \`other.scss\` | 过渡动画、透明度等 |

---

## 九、最佳实践

### 9.1 变量命名规范检查

| 层级 | ✅ 正确 | ❌ 错误 |
|------|---------|---------|
| 业务层 SCSS | \`$lee-font-size-base\` | \`$font-size-base\` |
| 框架层 SCSS | \`$lee-layout-header-height\` | \`$header-height\` |
| 业务层 CSS | \`--lee-primary-color\` | \`--primary-color\` |
| 框架层 CSS | \`--lee-basic-header-bg\` | \`--header-bg\` |

### 9.2 颜色值规范

\`\`\`scss
// ✅ 推荐：使用具体颜色值
--lee-basic-content-bg: #fcfcfc;

// ✅ 推荐：带透明度使用 rgba
--lee-basic-header-shadow: rgba(0, 21, 41, 0.08);

// ❌ 避免：在暗色主题中使用纯黑/纯白
--lee-basic-content-bg: #000000;  // 太深，建议 #070707 或 #0d0d0d
\`\`\`

### 9.3 主题变量组织

\`\`\`scss
// ✅ 推荐：按功能分组，添加注释
.light-color-theme {
  // =========================
  // 头部颜色 (--lee-basic-header)
  // =========================
  --lee-basic-header-bg: #ffffff;
  --lee-basic-header-border: #f0f0f0;
  --lee-basic-header-shadow: rgba(0, 21, 41, 0.08);
  
  // =========================
  // 侧边栏颜色 (--lee-basic-sidebar)
  // =========================
  --lee-basic-sidebar-bg: #ffffff;
  --lee-basic-sidebar-border-color: #f0f0f0;
}
\`\`\`

### 9.4 主题适配检查清单

在开发新组件时，检查以下项目：

- [ ] 背景色是否使用主题变量
- [ ] 边框色是否使用主题变量
- [ ] 文字色是否使用主题变量
- [ ] 阴影是否使用主题变量
- [ ] 悬停/激活状态是否有对应的主题变量
- [ ] 亮色和暗色主题下视觉效果是否合适
- [ ] 对比度是否满足可读性要求
- [ ] 变量命名是否符合规范（业务层 \`$lee-\` / 框架层 \`$lee-layout-\`）

### 9.5 调试主题变量

\`\`\`typescript
// 在控制台查看所有主题变量
const styles = getComputedStyle(document.documentElement);
console.log('Header BG:', styles.getPropertyValue('--lee-basic-header-bg'));

// 动态修改主题变量（用于调试）
document.documentElement.style.setProperty('--lee-basic-header-bg', '#ff0000');
\`\`\`

---

## 📚 参考资料

| 资源 | 链接 |
|------|------|
| CSS Custom Properties | [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) |
| SCSS 变量和映射 | [Sass 官方文档](https://sass-lang.com/documentation/values/maps) |
| Zustand 持久化 | [Zustand Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) |
| Ant Design 主题 | [Ant Design 主题定制](https://ant.design/docs/react/customize-theme) |

---

## 📝 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-01-21 | 初始版本，基于项目实际实现编写 |

---

> **文档维护**: 如有问题或建议，请联系项目负责人或在项目仓库提交 Issue。
`;export{e as default};
