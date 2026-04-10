# 技术栈约束

## UI 框架

- **Ant Design 6.1.x** (禁用其他 UI 框架)
- 必须使用 Ant Design 组件库
- 禁止引入其他 UI 框架（如 Material-UI、Element UI 等）

## 状态管理

- **Zustand 5.0.x** (禁用 Redux/MobX)
- 使用 Zustand 进行全局状态管理
- 禁止使用 Redux、MobX 等其他状态管理库

## 路由

- **React Router 7.12.x**
- 使用 React Router 进行路由管理

## 国际化

- **i18next 25.7.x** + **react-i18next 16.5.x**
- 使用 i18next 进行国际化处理

## 样式

- **SCSS 1.97.x** + **TailwindCSS 4.1.x**
- 优先使用 TailwindCSS 工具类
- 复杂样式使用 SCSS 文件
