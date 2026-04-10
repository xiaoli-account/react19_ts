# 组件规则

## 组件结构

- **一个组件一个文件**
- 使用 `index.tsx` 作为入口点
- 样式文件命名为 `styles.scss`
- 类型定义放在 `types.ts` 文件中

## 组件目录结构

```
component-name/
  ├── index.tsx      # 组件入口
  ├── types.ts        # 类型定义
  └── styles.scss     # 样式文件
```

## 组件编写规范

- 使用函数式组件
- 使用 Hooks 管理状态和副作用
- 使用 TypeScript 定义 Props 类型
- 添加必要的注释和文档

## 组件导出

- 使用默认导出组件
- 类型定义单独导出

## 示例

```tsx
// types.ts
export interface UserCardProps {
  name: string;
  age: number;
}

// index.tsx
import type { UserCardProps } from './types';
import './styles.scss';

export default function UserCard({ name, age }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{age} 岁</p>
    </div>
  );
}
```
