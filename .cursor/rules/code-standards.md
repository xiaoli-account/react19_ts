# 代码规范

## TypeScript

- 使用 TypeScript strict mode
- 所有代码必须符合 TypeScript 类型安全要求
- 使用明确的类型定义，避免使用 `any`

## 代码风格

- 遵循 ESLint + Prettier 规范
- 使用函数式组件 + Hooks
- 优先使用 `const`，避免使用 `let`
- 使用箭头函数

## 路径别名

- `@/` → `src/`
- `@AI/` 或 `@ai/` → `src_ai/`

## 导入规则

- 导入顺序: React → 第三方库 → 本地模块
- 使用路径别名而非相对路径
- 按字母顺序排列同组导入
