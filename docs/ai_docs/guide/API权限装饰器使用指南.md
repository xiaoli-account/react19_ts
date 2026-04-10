<!-- @format -->

# API 权限装饰器使用说明

## 概述

`@RequireApiPermission` 是一个简洁的 API 接口权限控制装饰器，集成在 `/src/layout/utils/permission.ts` 中。

## 核心特性

1. **一对一权限控制** - 每个接口方法对应一个权限标识
2. **白名单机制** - 白名单中的接口跳过权限验证
3. **自动拦截** - 无权限时不会调用接口
4. **简洁语法** - 只需传入权限标识字符串

## 使用方法

### ⚠️ 重要：装饰器顺序

**`@LeeApiPermission` 必须放在最上面（第一个装饰器），否则权限检查会失效！**

```typescript
// ✅ 正确 - 权限检查在最外层
@LeeApiPermission("api:/login")
@LeeLoggerMethod({...})
login(data: LoginInfo) {
  return $post("/login", data);
}

// ❌ 错误 - 权限检查在内层，接口仍会被调用
@LeeLoggerMethod({...})
@LeeApiPermission("api:/login")
login(data: LoginInfo) {
  return $post("/login", data);
}
```

**原因：**
- 装饰器执行顺序是**从下到上**
- 但装饰效果是**从上到下**应用
- 如果 `@LeeApiPermission` 在下面，它会先包装方法，但外层的装饰器（如 `@LeeLoggerMethod`）会先执行
- 这导致即使权限检查失败，外层装饰器已经调用了原始方法

### 基本用法

```typescript
import { RequireApiPermission } from "@/layout/utils/permission";

export class LoginService {
  // 在方法上添加装饰器，传入权限标识
  @RequireApiPermission("api:/login")
  login(data: LoginInfo) {
    return $post("/login", data);
  }
}
```

### 与日志装饰器组合使用

**重要：权限装饰器必须在最上面！**

```typescript
export class LoginService {
  // ✅ 正确顺序：@LeeApiPermission 在最上面
  @LeeApiPermission("api:/login")
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGIN,
  })
  login(data: LoginInfo) {
    return $post("/login", data);
  }
}
```

## 权限配置

### 1. 配置权限列表

在 `/src/layout/utils/permission.ts` 中配置：

```typescript
const apiPermissionList: string[] = [
  // "api:/login",  // 注释掉表示没有此权限
  "api:/logout",
  "api:/user/registerUser",
  "api:/getUserInfo",
  "api:/validateToken",
];
```

### 2. 配置白名单

白名单中的接口会跳过权限验证：

```typescript
/**
 * API接口白名单
 */
const apiWhiteList: string[] = [
  "api:/login", // 登录接口在白名单中，跳过权限验证
];
```

## 工作流程

```
方法调用
  ↓
检查是否在白名单
  ↓ 是
  跳过验证，直接执行
  ↓ 否
检查是否有权限
  ↓ 有
  执行方法
  ↓ 无
  抛出错误，不执行方法
```

## 权限验证逻辑

1. **白名单优先** - 如果接口在白名单中，直接执行，不检查权限
2. **权限检查** - 检查 `apiPermissionList` 中是否包含该权限
3. **无权限拦截** - 如果没有权限，抛出错误，不会发送实际请求

## 控制台日志

### 白名单接口

```
[API Permission] 接口 api:/login 在白名单中，跳过权限验证
```

### 有权限

```
[API Permission] Method: login, Permission: api:/login - 验证通过
```

### 无权限

```
[API Permission Denied] Method: getUserInfo, Permission: api:/getUserInfo
```

## 错误处理

当权限不足时，会抛出包含以下信息的错误：

```typescript
{
  message: "您没有权限访问此接口: api:/getUserInfo",
  code: "PERMISSION_DENIED",
  permission: "api:/getUserInfo",
  method: "getUserInfo"
}
```

### 捕获错误示例

```typescript
try {
  await loginService.getUserInfo();
} catch (error: any) {
  if (error.code === "PERMISSION_DENIED") {
    console.log("权限不足:", error.message);
    console.log("缺少的权限:", error.permission);
  }
}
```

## 测试方法

### 测试无权限场景

1. 在 `permission.ts` 中注释掉某个权限：

```typescript
const apiPermissionList: string[] = [
  // "api:/getUserInfo", // 注释掉这个权限
  "api:/logout",
];
```

2. 调用该接口，观察控制台输出和错误信息

### 测试白名单机制

1. 将接口添加到白名单：

```typescript
const apiWhiteList: string[] = ["api:/login", "api:/getUserInfo"];
```

2. 即使权限列表中没有该权限，接口也能正常调用

## 完整示例

```typescript
/** @format */

import { $get, $post } from "@/layout/utils/request";
import type { LoginInfo, RegisterInfo } from "@/store/user";
import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";
import { RequireApiPermission } from "@/layout/utils/permission";

export class LoginService {
  // 登录 - 在白名单中，跳过权限验证
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGIN,
  })
  @RequireApiPermission("api:/login")
  login(data: LoginInfo) {
    return $post("/login", data);
  }

  // 登出 - 需要权限验证
  @RequireApiPermission("api:/logout")
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGOUT,
  })
  logout() {
    return $post("/logout");
  }

  // 注册用户 - 需要权限验证
  @RequireApiPermission("api:/user/registerUser")
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.REGISTER,
  })
  registerUser(data: RegisterInfo) {
    return $post("/user/registerUser", data);
  }

  // 获取用户信息 - 需要权限验证
  @RequireApiPermission("api:/getUserInfo")
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户管理",
    operation: OPERATION_TYPE.READ,
  })
  getUserInfo() {
    return $get("/getUserInfo");
  }

  // 验证Token - 需要权限验证
  @RequireApiPermission("api:/validateToken")
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.READ,
  })
  checkToken(token?: string) {
    return new Promise<boolean>((resolve, reject) => {
      $post("/validateToken", { token })
        .then((res) => {
          const isValid = res.data ?? true;
          resolve(isValid);
        })
        .catch((err) => {
          console.error("checkToken", err);
          reject(false);
        });
    });
  }
}
```

## 权限标识命名规范

```
api:/接口路径
```

**示例：**

- `api:/login` - 登录接口
- `api:/logout` - 登出接口
- `api:/user/registerUser` - 注册用户接口
- `api:/getUserInfo` - 获取用户信息接口
- `api:/validateToken` - 验证 Token 接口

## 注意事项

1. **装饰器顺序** - 权限检查装饰器可以放在任意位置，但建议放在靠近方法定义的位置
2. **白名单优先** - 白名单中的接口会跳过权限验证，适用于公开接口（如登录、注册等）
3. **一对一映射** - 每个方法只需要一个权限标识，保持简洁
4. **错误处理** - 调用方应该捕获 `PERMISSION_DENIED` 错误并进行适当处理

## 与旧版装饰器的区别

| 特性           | 新版 (permission.ts)          | 旧版 (apiPermissionDecorator.ts) |
| -------------- | ----------------------------- | --------------------------------- |
| 参数           | 单个字符串                    | 对象配置                          |
| 白名单支持     | ✅ 内置支持                   | ❌ 不支持                         |
| 错误消息       | 统一格式                      | 可自定义                          |
| UI 提示        | ❌ 仅控制台日志               | ✅ 支持 message 提示              |
| 多权限支持     | ❌ 单个权限                   | ✅ 支持任意/全部                  |
| 自定义回调     | ❌ 不支持                     | ✅ 支持                           |
| 代码简洁度     | ⭐⭐⭐⭐⭐ 非常简洁            | ⭐⭐⭐ 较复杂                      |
| 适用场景       | 简单的一对一权限控制          | 复杂的权限控制场景                |

## 总结

新版 `@RequireApiPermission` 装饰器提供了：

- ✅ **简洁的 API** - 只需传入权限标识字符串
- ✅ **白名单机制** - 灵活控制公开接口
- ✅ **自动拦截** - 无权限时不会发送请求
- ✅ **一对一映射** - 每个接口对应一个权限
- ✅ **易于维护** - 集中在 permission.ts 中管理

适合大多数简单的 API 权限控制场景。如果需要更复杂的功能（如自定义错误消息、UI 提示、多权限组合等），可以使用 `apiPermissionDecorator.ts` 中的装饰器。
