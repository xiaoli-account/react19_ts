# 用户管理页面开发文档

## 📋 功能概述

用户管理页面实现了完整的 CRUD（创建、读取、更新、删除）功能，包括用户列表展示、搜索筛选、新建用户、编辑用户和删除用户。

## 🎯 功能特性

### 1. 用户列表展示

- ✅ 表格展示用户信息（用户名、邮箱、手机号、角色、状态、创建时间）
- ✅ 分页功能（支持页码跳转、每页条数切换）
- ✅ 角色标签（管理员/普通用户/访客）
- ✅ 状态标签（启用/禁用）

### 2. 搜索筛选

- ✅ 按用户名搜索
- ✅ 按邮箱搜索
- ✅ 按角色筛选
- ✅ 按状态筛选
- ✅ 重置搜索条件

### 3. 新建用户

- ✅ 用户名（必填，3-20字符，仅字母数字下划线）
- ✅ 邮箱（必填，邮箱格式验证）
- ✅ 手机号（必填，手机号格式验证）
- ✅ 密码（必填，6-20字符）
- ✅ 角色选择（必填）
- ✅ 状态选择（必填）

### 4. 编辑用户

- ✅ 修改邮箱
- ✅ 修改手机号
- ✅ 修改角色
- ✅ 修改状态
- ⚠️ 用户名不可修改
- ⚠️ 编辑时不显示密码字段

### 5. 删除用户

- ✅ 单个删除
- ✅ 删除确认弹窗
- ✅ 删除成功提示

## 📁 文件结构

```
user-management/
├── index.tsx                    # 页面入口（主逻辑）
├── types.ts                     # 类型定义
├── services.ts                  # API 接口
├── styles.scss                  # 页面样式
└── components/
    ├── user-table.tsx           # 用户表格组件
    └── user-form.tsx            # 用户表单组件
```

## 🔧 技术实现

### 1. 状态管理

使用 React Hooks 进行状态管理：

- `useState` - 管理列表数据、加载状态、表单状态
- `useEffect` - 监听查询参数变化，自动加载数据

### 2. 组件拆分

- **UserTable**: 用户表格组件，负责数据展示和操作按钮
- **UserForm**: 用户表单组件，负责新建和编辑用户

### 3. API 封装

所有 API 调用封装在 `services.ts` 中：

- `getUserList` - 获取用户列表
- `getUserById` - 获取用户详情
- `createUser` - 创建用户
- `updateUser` - 更新用户
- `deleteUser` - 删除用户
- `batchDeleteUsers` - 批量删除用户

### 4. 表单验证

使用 Ant Design Form 的验证规则：

- 必填验证
- 长度验证
- 格式验证（邮箱、手机号、用户名）

## 📊 数据流

```
用户操作 → 页面组件 → API 服务层 → 后端接口
                ↓
            状态更新
                ↓
            UI 重新渲染
```

## 🎨 UI 组件

### 使用的 Ant Design 组件

- `Card` - 卡片容器
- `Table` - 数据表格
- `Button` - 按钮
- `Input` - 输入框
- `Select` - 下拉选择
- `Modal` - 弹窗
- `Form` - 表单
- `Tag` - 标签
- `Space` - 间距
- `Popconfirm` - 确认弹窗
- `message` - 消息提示

## 🔌 API 接口说明

### 1. 获取用户列表

```typescript
GET /api/users
参数: {
  page: number;
  pageSize: number;
  username?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}
响应: {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 2. 创建用户

```typescript
POST / api / users;
参数: {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}
响应: User;
```

### 3. 更新用户

```typescript
PUT /api/users/:id
参数: {
  email?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive';
}
响应: User
```

### 4. 删除用户

```typescript
DELETE /api/users/:id
响应: { success: boolean }
```

## 💡 使用方法

### 1. 搜索用户

1. 在搜索栏输入搜索条件
2. 点击"搜索"按钮
3. 表格自动更新显示搜索结果

### 2. 新建用户

1. 点击"新建用户"按钮
2. 填写用户信息
3. 点击"确定"提交
4. 表格自动刷新显示新用户

### 3. 编辑用户

1. 点击用户行的"编辑"按钮
2. 修改用户信息
3. 点击"确定"提交
4. 表格自动刷新显示更新后的信息

### 4. 删除用户

1. 点击用户行的"删除"按钮
2. 确认删除操作
3. 表格自动刷新

## ⚠️ 注意事项

### 1. 后端接口

当前代码使用的是模拟接口路径（`/api/users`），实际使用时需要：

- 确保后端接口已实现
- 根据实际接口路径修改 `services.ts`
- 确保接口返回数据格式与类型定义一致

### 2. Mock 数据

如果需要在开发环境使用 Mock 数据，可以：

- 使用 MSW (Mock Service Worker)
- 或在 Vite 配置中添加 Mock 插件
- 或使用后端提供的 Mock 接口

### 3. 权限控制

当前代码未实现权限控制，如需添加：

- 在操作按钮处添加权限判断
- 使用 `usePermission` Hook 检查用户权限
- 根据权限显示/隐藏操作按钮

### 4. 批量操作

代码中已预留批量删除接口，如需实现：

- 在表格中添加复选框
- 添加批量操作按钮
- 调用 `batchDeleteUsers` 接口

## 🚀 扩展功能建议

### 1. 批量操作

- 批量删除
- 批量启用/禁用
- 批量导出

### 2. 高级搜索

- 创建时间范围筛选
- 更新时间范围筛选
- 更多字段筛选

### 3. 用户详情

- 查看用户详细信息
- 用户操作日志
- 用户权限详情

### 4. 导入导出

- Excel 导入用户
- Excel 导出用户列表
- 模板下载

### 5. 密码管理

- 重置密码
- 修改密码
- 密码强度验证

## 📝 代码示例

### 调用用户列表

```typescript
const loadUserList = async () => {
  setLoading(true);
  try {
    const response = await getUserList({
      page: 1,
      pageSize: 10,
    });
    setUserList(response.list);
    setTotal(response.total);
  } catch (error) {
    message.error('加载失败');
  } finally {
    setLoading(false);
  }
};
```

### 创建用户

```typescript
const handleCreate = async (values: UserFormData) => {
  try {
    await createUser(values);
    message.success('创建成功');
    loadUserList();
  } catch (error) {
    message.error('创建失败');
  }
};
```

## 🔗 相关文档

- [Ant Design Table 文档](https://ant.design/components/table-cn)
- [Ant Design Form 文档](https://ant.design/components/form-cn)
- [React Hooks 文档](https://react.dev/reference/react)
- [项目开发规范](../../docs/项目开发规范/React%20企业级项目设计规范.md)

---

**创建时间**: 2026-01-22  
**版本**: v1.0.0
