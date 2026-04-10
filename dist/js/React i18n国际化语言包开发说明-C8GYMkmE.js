const n=`# React 国际化语言包开发说明

> **版本**: v1.0.0  
> **更新时间**: 2026-01-21  
> **适用范围**: React 19 企业级后台管理系统

---

## 📋 目录

- [一、概述](#一概述)
- [二、国际化系统架构](#二国际化系统架构)
- [三、语言包文件结构](#三语言包文件结构)
- [四、命名空间规范](#四命名空间规范)
- [五、语言切换实现](#五语言切换实现)
- [六、使用方法](#六使用方法)
- [七、新增语言包指南](#七新增语言包指南)
- [八、最佳实践](#八最佳实践)

---

## 一、概述

### 1.1 设计目标

项目采用 **react-i18next** 作为国际化解决方案，支持：

| 特性 | 说明 |
|------|------|
| 多语言支持 | 当前支持中文 (zh-CN) 和英文 (en-US) |
| 动态切换 | 运行时切换语言，无需刷新 |
| 状态持久化 | 语言偏好自动保存 |
| 分层设计 | 框架层与业务层语言包分离 |
| 命名空间隔离 | 防止翻译键冲突 |
| 冲突检测 | 自动检测重复命名空间 |

### 1.2 技术方案

| 技术 | 用途 |
|------|------|
| i18next | 国际化核心库 |
| react-i18next | React 集成 |
| Zustand | 语言状态管理 |
| localStorage | 语言偏好持久化 |

### 1.3 支持的语言

| 语言 | 代码 | 状态 | 说明 |
|------|------|------|------|
| 简体中文 | zh-CN | ✅ 完整 | 默认语言 |
| 英语 | en-US | ✅ 完整 | 完整支持 |
| 繁体中文 | zh-TW | 📋 计划 | 待开发 |
| 日语 | ja-JP | 📋 计划 | 待开发 |

---

## 二、国际化系统架构

### 2.1 架构图

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                     I18nStore (Zustand)                     │
│  - locale: 'zh-CN' | 'en-US'                               │
│  - setLanguage(locale)                                      │
│  - getI18nByKey(key)                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     i18next Instance                         │
│  - resources: { 'zh-CN': {...}, 'en-US': {...} }            │
│  - lng: 'zh-CN'                                              │
│  - fallbackLng: 'zh-CN'                                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   Layout Language Pack   │    │  Business Language Pack  │
│   src/layout/i18n/       │    │   src/i18n/              │
│   (框架层语言包)          │    │   (业务层语言包)         │
└──────────────────────────┘    └──────────────────────────┘
\`\`\`

### 2.2 分层设计

项目采用 **框架层** 与 **业务层** 分离的语言包设计：

| 层级 | 目录 | 命名空间前缀 | 说明 |
|------|------|--------------|------|
| 框架层 | \`src/layout/i18n/\` | \`lee-layout-\` | 布局组件使用的文案 |
| 业务层 | \`src/i18n/\` | 业务模块名 | 业务页面使用的文案 |

### 2.3 语言切换流程

\`\`\`text
1. 用户点击语言切换按钮
       │
       ▼
2. 调用 i18nStore.setLanguage('en-US')
       │
       ▼
3. 更新 Zustand 状态
       │
       ▼
4. 调用 i18n.changeLanguage('en-US')
       │
       ▼
5. 更新 document.documentElement.lang
       │
       ▼
6. 组件自动重新渲染（使用 useTranslation）
       │
       ▼
7. 状态持久化到 localStorage
\`\`\`

---

## 三、语言包文件结构

### 3.1 整体目录结构

\`\`\`text
src/
├── i18n/                           # 业务页面语言包
│   ├── index.ts                    # 业务语言包入口
│   ├── zh-CN/
│   │   ├── index.ts                # 中文语言包入口
│   │   ├── login.json              # 登录页文案
│   │   └── webSite.json            # 网站信息文案
│   └── en-US/
│       ├── index.ts                # 英文语言包入口
│       ├── login.json              # 登录页文案
│       └── webSite.json            # 网站信息文案
│
└── layout/
    ├── i18n/                       # 布局组件语言包
    │   ├── index.ts                # i18next 初始化配置
    │   ├── zh-CN/
    │   │   ├── index.ts            # 中文语言包入口
    │   │   ├── lee-layout-header.json
    │   │   ├── lee-layout-language.json
    │   │   ├── lee-layout-layout.json
    │   │   └── lee-layout-routes.json
    │   └── en-US/
    │       ├── index.ts            # 英文语言包入口
    │       ├── lee-layout-header.json
    │       ├── lee-layout-language.json
    │       ├── lee-layout-layout.json
    │       └── lee-layout-routes.json
    │
    └── stores/
        └── i18nStore.ts            # 语言状态管理
\`\`\`

### 3.2 业务层语言包入口 (src/i18n/index.ts)

\`\`\`typescript
import zhCN from './zh-CN/index';
import enUS from './en-US/index';

export const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
};
\`\`\`

### 3.3 业务层语言包 (src/i18n/zh-CN/index.ts)

\`\`\`typescript
import login from './login.json';
import webSite from './webSite.json';

export default {
  login,      // 登录页文案
  webSite,    // 网站信息文案
};
\`\`\`

### 3.4 框架层语言包入口 (src/layout/i18n/zh-CN/index.ts)

\`\`\`typescript
import header from './lee-layout-header.json';
import language from './lee-layout-language.json';
import layout from './lee-layout-layout.json';
import routes from './lee-layout-routes.json';

export default {
  'lee-layout-webSite': {
    name: 'React19_Ts 后台管理系统',
    description: 'React19_Ts 后台管理系统 是一个基于 React 19 + TypeScript 的后台管理系统',
  },
  'lee-layout-header': header,
  'lee-layout-layout': layout,
  'lee-layout-language': language,
  'lee-layout-routes': routes,
};
\`\`\`

### 3.5 语言包 JSON 文件示例

#### 登录页文案 (login.json)

\`\`\`json
{
  "login": "登录",
  "register": "注册",
  "loginTabAccount": "账户密码登录",
  "loginTabPhone": "手机号登录",
  "loginTabEmail": "邮箱登录",
  "placeholderPhone": "请输入手机号",
  "placeholderCode": "请输入验证码",
  "placeholderUsername": "请输入用户名 admin",
  "placeholderPassword": "请输入密码 admin123",
  "placeholderEmail": "请输入邮箱",
  "getCode": "获取验证码",
  "forgotPassword": "忘记密码",
  "remember": "记住密码",
  "otherLoginMethods": "其他登录方式:",
  "noAccount": "没有账户? ",
  "logining": "登录中...",
  "loginSuccess": "登录成功",
  "loginFailed": "登录失败",
  "invalidCredentials": "用户名或密码错误"
}
\`\`\`

#### 布局头部文案 (lee-layout-header.json)

\`\`\`json
{
  "toggleSidebar": "切换侧边栏",
  "profile": "个人中心",
  "personalSettings": "个人设置",
  "logout": "退出登录",
  "language": "语言",
  "theme": "主题",
  "searchMenuPlaceholder": "搜索菜单",
  "layout": "布局",
  "langZhShort": "中文",
  "langEnShort": "EN",
  "darkTheme": "深色主题",
  "lightTheme": "浅色主题"
}
\`\`\`

---

## 四、命名空间规范

### 4.1 命名空间划分

| 层级 | 命名空间 | 说明 |
|------|----------|------|
| 框架层 | \`lee-layout-webSite\` | 网站基本信息 |
| 框架层 | \`lee-layout-header\` | 头部组件文案 |
| 框架层 | \`lee-layout-layout\` | 布局相关文案 |
| 框架层 | \`lee-layout-language\` | 语言切换文案 |
| 框架层 | \`lee-layout-routes\` | 路由/菜单文案 |
| 业务层 | \`login\` | 登录页文案 |
| 业务层 | \`webSite\` | 网站信息文案 |
| 业务层 | \`user\` | 用户管理文案 |
| 业务层 | \`dashboard\` | 仪表盘文案 |

### 4.2 命名空间冲突检测

框架层会自动检测命名空间冲突：

\`\`\`typescript
// src/layout/i18n/index.ts
const getResouces = () => {
  const mergedResources = {};

  Object.keys(resources).forEach(locale => {
    const layoutNamespaces = new Set();
    const businessNamespaces = new Set();
    const duplicateNamespaces = [];

    // 收集所有命名空间
    Object.keys(resources[locale].translation).forEach(key => {
      layoutNamespaces.add(key);
    });

    if (businessResources[locale]?.translation) {
      Object.keys(businessResources[locale].translation).forEach(key => {
        businessNamespaces.add(key);
      });

      // 检测重复
      businessNamespaces.forEach(namespace => {
        if (layoutNamespaces.has(namespace)) {
          duplicateNamespaces.push(namespace);
        }
      });

      // 抛出错误
      if (duplicateNamespaces.length > 0) {
        throw new Error(
          \`国际化语言包冲突检测到重复命名空间 [\${locale}]: \${duplicateNamespaces.join(', ')}\\n\` +
          \`请确保业务页面和 layout 的语言包命名空间不重复。\`
        );
      }
    }

    // 合并语言包
    mergedResources[locale] = {
      translation: {
        ...businessResources[locale]?.translation,
        ...resources[locale].translation,
      },
    };
  });

  return mergedResources;
};
\`\`\`

### 4.3 命名空间建议

| 类型 | 建议命名 | 示例 |
|------|----------|------|
| 框架层 | \`lee-layout-{module}\` | \`lee-layout-header\` |
| 业务页面 | 页面名称 | \`login\`、\`user\`、\`dashboard\` |
| 业务模块 | 模块名称 | \`userManagement\`、\`roleManagement\` |
| 通用文案 | \`common\` | \`common\` |

---

## 五、语言切换实现

### 5.1 语言状态管理 (i18nStore.ts)

\`\`\`typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

export interface I18nState {
  locale: 'zh-CN' | 'en-US';
  setLanguage: (locale: 'zh-CN' | 'en-US') => void;
  getI18nByKey: (key: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    set => ({
      locale: 'zh-CN',
      
      /**
       * 设置语言
       * @param locale 语言
       */
      setLanguage: locale => {
        set({ locale });
        // 更新 HTML lang 属性
        document.documentElement.lang = locale;
        // 同步 i18next 语言
        if (i18n.language !== locale) {
          void i18n.changeLanguage(locale);
        }
      },
      
      /**
       * 通过key获取文案
       * @param key 文案key
       * @returns 文案
       */
      getI18nByKey: (key: string) => {
        return i18n.t(key);
      },
    }),
    {
      name: 'layout-i18n-storage',
      partialize: state => ({
        locale: state.locale,
      }),
    }
  )
);
\`\`\`

### 5.2 i18next 初始化 (src/layout/i18n/index.ts)

\`\`\`typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './zh-CN/index';
import enUS from './en-US/index';
import { resources as businessResources } from '@/i18n/index';

const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
};

/**
 * 获取缓存的语言设置
 */
const getInitialLanguage = () => {
  try {
    const persistedState = localStorage.getItem('layout-i18n-storage');
    if (persistedState) {
      const { state } = JSON.parse(persistedState);
      return state?.locale || 'zh-CN';
    }
  } catch (error) {
    console.warn('Failed to get initial language from localStorage:', error);
  }
  return 'zh-CN';
};

i18n.use(initReactI18next).init({
  resources: getResouces(),
  lng: getInitialLanguage(),
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
\`\`\`

### 5.3 语言 Hook (use-i18n.ts)

\`\`\`typescript
import { useI18nStore } from '../stores/i18nStore';

export const useI18n = () => {
  const { locale, setLanguage, getI18nByKey } = useI18nStore();
  
  return {
    locale,
    setLanguage,
    getI18nByKey,
    isZhCN: locale === 'zh-CN',
    isEnUS: locale === 'en-US',
  };
};
\`\`\`

---

## 六、使用方法

### 6.1 在 React 组件中使用 useTranslation

\`\`\`tsx
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('login.login')}</h1>
      <input placeholder={t('login.placeholderUsername')} />
      <input type="password" placeholder={t('login.placeholderPassword')} />
      <button>{t('login.login')}</button>
    </div>
  );
};
\`\`\`

### 6.2 使用不同命名空间

\`\`\`tsx
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* 框架层文案 */}
      <span>{t('lee-layout-header.logout')}</span>
      <span>{t('lee-layout-header.profile')}</span>
      
      {/* 业务层文案 */}
      <span>{t('webSite.copyright')}</span>
    </div>
  );
};
\`\`\`

### 6.3 带参数的翻译

\`\`\`json
// login.json
{
  "welcome": "欢迎，{{username}}！",
  "itemCount": "共 {{count}} 项"
}
\`\`\`

\`\`\`tsx
const Welcome = ({ username, count }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <p>{t('login.welcome', { username })}</p>
      <p>{t('login.itemCount', { count })}</p>
    </div>
  );
};
\`\`\`

### 6.4 使用 i18n Hook

\`\`\`tsx
import { useI18n } from '@/layout/hooks/use-i18n';

const LanguageSelector = () => {
  const { locale, setLanguage, isZhCN } = useI18n();
  
  return (
    <div>
      <p>当前语言: {locale}</p>
      <button onClick={() => setLanguage('zh-CN')}>中文</button>
      <button onClick={() => setLanguage('en-US')}>English</button>
    </div>
  );
};
\`\`\`

### 6.5 在非组件环境中使用

\`\`\`typescript
import i18n from '@/layout/i18n';

// 在工具函数中使用
const formatMessage = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// 在路由配置中使用
const routes = [
  {
    path: '/dashboard',
    meta: {
      title: i18n.t('lee-layout-routes.Dashboard'),
    },
  },
];
\`\`\`

### 6.6 在 Header 中切换语言

\`\`\`tsx
import { Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../hooks/use-i18n';

const Header = () => {
  const { t } = useTranslation();
  const { locale, setLanguage } = useI18n();

  const languageMenuItems = [
    { key: 'zh-CN', label: '简体中文' },
    { key: 'en-US', label: 'English' },
  ];

  return (
    <Dropdown
      menu={{
        items: languageMenuItems,
        onClick: ({ key }) => setLanguage(key as 'zh-CN' | 'en-US'),
      }}
      placement="bottomRight"
    >
      <Button icon={<GlobalOutlined />}>
        {locale === 'zh-CN' ? t('lee-layout-header.langZhShort') : t('lee-layout-header.langEnShort')}
      </Button>
    </Dropdown>
  );
};
\`\`\`

---

## 七、新增语言包指南

### 7.1 新增业务页面语言包

1. **创建 JSON 文件**

\`\`\`bash
# 创建用户管理语言包
touch src/i18n/zh-CN/user.json
touch src/i18n/en-US/user.json
\`\`\`

2. **编写中文语言包 (zh-CN/user.json)**

\`\`\`json
{
  "title": "用户管理",
  "addUser": "新增用户",
  "editUser": "编辑用户",
  "deleteUser": "删除用户",
  "username": "用户名",
  "email": "邮箱",
  "phone": "手机号",
  "role": "角色",
  "status": "状态",
  "statusEnabled": "启用",
  "statusDisabled": "禁用",
  "confirmDelete": "确定要删除该用户吗？",
  "deleteSuccess": "删除成功",
  "saveSuccess": "保存成功"
}
\`\`\`

3. **编写英文语言包 (en-US/user.json)**

\`\`\`json
{
  "title": "User Management",
  "addUser": "Add User",
  "editUser": "Edit User",
  "deleteUser": "Delete User",
  "username": "Username",
  "email": "Email",
  "phone": "Phone",
  "role": "Role",
  "status": "Status",
  "statusEnabled": "Enabled",
  "statusDisabled": "Disabled",
  "confirmDelete": "Are you sure you want to delete this user?",
  "deleteSuccess": "Deleted successfully",
  "saveSuccess": "Saved successfully"
}
\`\`\`

4. **注册语言包**

\`\`\`typescript
// src/i18n/zh-CN/index.ts
import login from './login.json';
import webSite from './webSite.json';
import user from './user.json';  // 新增

export default {
  login,
  webSite,
  user,  // 新增
};
\`\`\`

5. **在组件中使用**

\`\`\`tsx
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('user.title')}</h1>
      <button>{t('user.addUser')}</button>
    </div>
  );
};
\`\`\`

### 7.2 新增框架层语言包

1. **创建 JSON 文件**

\`\`\`bash
# 创建新的框架语言包
touch src/layout/i18n/zh-CN/lee-layout-footer.json
touch src/layout/i18n/en-US/lee-layout-footer.json
\`\`\`

2. **编写语言包**

\`\`\`json
// zh-CN/lee-layout-footer.json
{
  "copyright": "© 2026 React Admin. All rights reserved.",
  "version": "版本",
  "documentation": "文档",
  "support": "技术支持"
}
\`\`\`

3. **注册语言包**

\`\`\`typescript
// src/layout/i18n/zh-CN/index.ts
import header from './lee-layout-header.json';
import footer from './lee-layout-footer.json';  // 新增
// ...

export default {
  // ...
  'lee-layout-footer': footer,  // 新增
};
\`\`\`

### 7.3 新增语言支持

1. **创建语言目录**

\`\`\`bash
mkdir src/i18n/ja-JP
mkdir src/layout/i18n/ja-JP
\`\`\`

2. **复制并翻译所有语言包**

3. **更新语言包入口**

\`\`\`typescript
// src/i18n/index.ts
import zhCN from './zh-CN/index';
import enUS from './en-US/index';
import jaJP from './ja-JP/index';  // 新增

export const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
  'ja-JP': { translation: jaJP },  // 新增
};
\`\`\`

4. **更新类型定义**

\`\`\`typescript
// src/layout/stores/i18nStore.ts
export interface I18nState {
  locale: 'zh-CN' | 'en-US' | 'ja-JP';  // 新增 ja-JP
  setLanguage: (locale: 'zh-CN' | 'en-US' | 'ja-JP') => void;
  // ...
}
\`\`\`

5. **更新语言选择器**

\`\`\`typescript
const languageMenuItems = [
  { key: 'zh-CN', label: '简体中文' },
  { key: 'en-US', label: 'English' },
  { key: 'ja-JP', label: '日本語' },  // 新增
];
\`\`\`

---

## 八、最佳实践

### 8.1 命名规范

| 规则 | ✅ 推荐 | ❌ 避免 |
|------|---------|---------|
| 使用 camelCase | \`loginSuccess\` | \`login_success\` |
| 语义化命名 | \`confirmDelete\` | \`btn1\` |
| 层级清晰 | \`user.addUser\` | \`addUser\` |
| 避免重复 | \`user.title\` | \`userTitle\` |

### 8.2 翻译键组织

\`\`\`json
// ✅ 推荐：按功能分组
{
  "form": {
    "username": "用户名",
    "password": "密码",
    "submit": "提交"
  },
  "table": {
    "actions": "操作",
    "edit": "编辑",
    "delete": "删除"
  },
  "message": {
    "success": "操作成功",
    "error": "操作失败"
  }
}

// ❌ 避免：扁平结构
{
  "username": "用户名",
  "password": "密码",
  "submit": "提交",
  "actions": "操作",
  "edit": "编辑"
}
\`\`\`

### 8.3 翻译内容规范

\`\`\`json
// ✅ 推荐：简洁明了
{
  "save": "保存",
  "cancel": "取消",
  "confirm": "确认"
}

// ❌ 避免：冗长描述
{
  "save": "点击此按钮保存当前内容",
  "cancel": "点击此按钮取消当前操作"
}
\`\`\`

### 8.4 参数使用规范

\`\`\`json
// ✅ 推荐：使用有意义的参数名
{
  "welcome": "欢迎，{{username}}！",
  "itemCount": "共 {{count}} 项",
  "lastLogin": "上次登录：{{time}}"
}

// ❌ 避免：使用无意义的参数名
{
  "welcome": "欢迎，{{0}}！",
  "itemCount": "共 {{n}} 项"
}
\`\`\`

### 8.5 翻译完整性检查清单

在发布前检查以下项目：

- [ ] 所有语言包文件结构一致
- [ ] 所有翻译键在各语言中都有对应翻译
- [ ] 参数名称在各语言中保持一致
- [ ] 没有硬编码的中文或英文文案
- [ ] 日期、数字格式符合目标语言习惯
- [ ] 命名空间没有冲突

### 8.6 调试语言包

\`\`\`typescript
// 查看当前语言
console.log('Current language:', i18n.language);

// 查看所有已加载的资源
console.log('Resources:', i18n.store.data);

// 检查翻译键是否存在
console.log('Has key:', i18n.exists('login.title'));

// 获取翻译值
console.log('Translation:', i18n.t('login.title'));
\`\`\`

---

## 📚 参考资料

| 资源 | 链接 |
|------|------|
| i18next 官方文档 | [i18next.com](https://www.i18next.com/) |
| react-i18next 文档 | [react.i18next.com](https://react.i18next.com/) |
| ISO 639-1 语言代码 | [Wikipedia](https://en.wikipedia.org/wiki/ISO_639-1) |
| ISO 3166-1 国家代码 | [Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1) |

---

## 📝 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-01-21 | 初始版本，基于项目实际实现编写 |

---

> **文档维护**: 如有问题或建议，请联系项目负责人或在项目仓库提交 Issue。
`;export{n as default};
