const n=`# React 企业级项目日志系统架构设计

## 📋 文档信息

- **项目名称**: React19 + TypeScript 企业级管理系统
- **文档版本**: v3.0.0
- **创建日期**: 2026-01-28
- **最后更新**: 2026-01-29
- **维护者**: 小李同学
- **文件位置**: \`src/layout/utils/leeLogger.ts\`

---

## 🎯 一、系统概述

### 1.1 LeeLogger 是什么？

**LeeLogger** 是一个专为企业级 React 应用设计的前端日志系统，提供完整的日志记录、管理和分析能力。

### 1.2 核心特性

✅ **多级别日志** - DEBUG/INFO/WARN/ERROR/FATAL 五级日志  
✅ **自动上下文采集** - 自动收集用户、路由、IP、设备信息  
✅ **装饰器支持** - 通过 \`@LeeLoggerMethod\` 装饰器无侵入式记录  
✅ **双模式记录** - 支持装饰器方式与函数方式共存  
✅ **灵活配置** - 支持日志级别、控制台输出、用户信息等配置  
✅ **日志管理** - 支持筛选、导出、删除、清空等操作  
✅ **持久化存储** - 基于 sessionStorage，最多保存 1000 条日志  
✅ **TypeScript 支持** - 完整的类型定义  
✅ **零依赖** - 无外部依赖，易于移植

### 1.3 应用场景

- 📊 **用户行为追踪** - 记录用户登录、操作、浏览等行为
- 🐛 **错误监控调试** - 捕获和记录应用错误，便于调试
- 📝 **业务流程审计** - 记录关键业务操作，满足审计要求
- ⚡ **性能分析** - 记录操作耗时，分析性能瓶颈
- 🔒 **合规性要求** - 满足企业合规性日志记录要求

---

## 🔧 二、项目配置

### 2.1 文件位置

\`\`\`
src/layout/utils/leeLogger.ts    # 日志系统核心文件
\`\`\`

### 2.2 装饰器配置

**前置条件**：项目已在 \`vite.config.ts\` 中配置装饰器支持（Stage 3 标准）

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  // ... 其他配置
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: false,  // 使用新版装饰器（Stage 3）
        useDefineForClassFields: true,
      },
    },
  },
});
\`\`\`

**注意**：
- 本项目使用 **Stage 3 装饰器**（新标准），不是旧版 experimentalDecorators
- 无需在 tsconfig.json 中启用 experimentalDecorators
- Vite 的 esbuild 配置已处理装饰器转译

### 2.3 系统初始化

**位置**: \`src/router/index.tsx\`

\`\`\`typescript
import { LeeLogger } from "@/layout/utils/leeLogger";
import { useUserStore } from "@/store/user";
import { route } from "@/router/routes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AppRouterV2 = () => {
  const location = useLocation();

  // 1. 初始化日志系统（只执行一次）
  useEffect(() => {
    LeeLogger.init({
      routes: route,                    // 路由配置数组
      level: LOG_LEVEL.DEBUG,           // 日志级别（可选）
      consoleEnabled: true,             // 控制台输出（可选）
      autoGetIP: true,                  // 自动获取IP（可选）
    });
  }, []); // 空依赖，只在组件挂载时执行一次

  // 2. 监听用户信息变化
  useEffect(() => {
    const userInfo = useUserStore.getState().userInfo;
    if (userInfo?.loginName && userInfo?.id) {
      LeeLogger.setCurrentUser(userInfo.loginName, userInfo.id);
    } else {
      LeeLogger.clearCurrentUser();
    }

    let previousLoginName = userInfo?.loginName;
    let previousUserId = userInfo?.id;

    const unsubscribe = useUserStore.subscribe((state) => {
      const currentLoginName = state.userInfo?.loginName;
      const currentUserId = state.userInfo?.id;

      if (
        previousLoginName !== currentLoginName ||
        previousUserId !== currentUserId
      ) {
        if (currentLoginName && currentUserId) {
          LeeLogger.setCurrentUser(currentLoginName, currentUserId);
        } else {
          LeeLogger.clearCurrentUser();
        }
        previousLoginName = currentLoginName;
        previousUserId = currentUserId;
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. 监听路由变化
  useEffect(() => {
    LeeLogger.setCurrentRoute(location.pathname);
  }, [location.pathname]);

  return <RouterProvider router={router} />;
};
\`\`\`

### 2.4 初始化配置选项

\`\`\`typescript
interface LoggerInitOptions {
  /** 路由配置数组，用于构建路由-模块映射表 */
  routes?: any[];
  
  /** 日志级别（默认: DEBUG） */
  level?: LogLevel;
  
  /** 是否启用控制台输出（默认: true） */
  consoleEnabled?: boolean;
  
  /** 当前用户信息 */
  currentUser?: {
    userName: string;
    userId: string;
  };
  
  /** 是否自动获取IP（默认: true） */
  autoGetIP?: boolean;
  
  /** 自定义初始化函数 */
  init?: () => void;
}
\`\`\`

---

## 🚀 三、快速开始

### 3.1 基础日志记录

\`\`\`typescript
import { LeeLogger } from '@/layout/utils/leeLogger';

// Debug 日志
LeeLogger.debug('调试信息', { debugData: {...} });

// Info 日志
LeeLogger.info('用户登录成功', { email: 'user@example.com' });

// Warn 日志
LeeLogger.warn('密码即将过期', { daysLeft: 3 });

// Error 日志
LeeLogger.error('请求失败', new Error('Network Error'));

// Fatal 日志
LeeLogger.fatal('系统崩溃', new Error('Out of Memory'));
\`\`\`

### 3.2 完整参数日志

\`\`\`typescript
import { LeeLogger, LOG_LEVEL, OPERATION_TYPE, OPERATION_STATUS } from '@/layout/utils/leeLogger';

LeeLogger.log({
  level: LOG_LEVEL.INFO,
  message: '用户创建成功',
  module: '用户管理',                    // 可选，不传则自动从路由推断
  operation: OPERATION_TYPE.CREATE,
  status: OPERATION_STATUS.SUCCESS,
  data: { userId: 123, userName: '张三' },
});
\`\`\`

### 3.3 使用装饰器（推荐）

\`\`\`typescript
import { LeeLoggerMethod, LOG_LEVEL, OPERATION_TYPE } from '@/layout/utils/leeLogger';

export class UserService {
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '用户管理',
    operation: OPERATION_TYPE.CREATE,
  })
  async createUser(data: UserData) {
    return await $post('/users', data);
  }

  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    module: '用户管理',
    operation: OPERATION_TYPE.DELETE,
  })
  async deleteUser(userId: string) {
    return await $delete(\`/users/\${userId}\`);
  }
}
\`\`\`

**装饰器优势**：
- ✅ 自动记录方法调用前后的日志
- ✅ 自动捕获异步方法的成功/失败状态
- ✅ 无侵入式，代码简洁
- ✅ 统一的日志格式

---

## 📖 四、使用示例

### 4.1 业务逻辑中使用

\`\`\`typescript
import { LeeLogger, OPERATION_TYPE, OPERATION_STATUS } from '@/layout/utils/leeLogger';

const handleSubmit = async (formData: any) => {
  try {
    const result = await submitAPI(formData);
    
    LeeLogger.info('表单提交成功', {
      operation: OPERATION_TYPE.SUBMIT,
      status: OPERATION_STATUS.SUCCESS,
      data: { formId: result.id },
    });
  } catch (error) {
    LeeLogger.error('表单提交失败', error as Error, {
      operation: OPERATION_TYPE.SUBMIT,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};
\`\`\`

### 4.2 登录场景

\`\`\`typescript
import { LeeLogger, OPERATION_TYPE, OPERATION_STATUS } from '@/layout/utils/leeLogger';

const handleLogin = async (credentials: LoginData) => {
  try {
    const result = await loginAPI(credentials);
    
    // 更新用户信息
    LeeLogger.setCurrentUser(result.userName, result.userId);
    
    // 记录登录成功日志
    LeeLogger.info('用户登录成功', {
      operation: OPERATION_TYPE.LOGIN,
      status: OPERATION_STATUS.SUCCESS,
      data: { 
        userName: result.userName,
        loginTime: new Date().toISOString()
      },
    });
  } catch (error) {
    LeeLogger.error('用户登录失败', error as Error, {
      operation: OPERATION_TYPE.LOGIN,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};
\`\`\`

### 4.3 登出场景

\`\`\`typescript
const handleLogout = () => {
  LeeLogger.info('用户登出', {
    operation: OPERATION_TYPE.LOGOUT,
    status: OPERATION_STATUS.SUCCESS,
  });
  
  // 清除用户信息（重置为默认用户）
  LeeLogger.clearCurrentUser();
  
  // 执行登出逻辑...
};
\`\`\`

### 4.4 CRUD 操作

\`\`\`typescript
// 创建
const handleCreate = async (data: any) => {
  try {
    const result = await createAPI(data);
    LeeLogger.info('创建成功', {
      operation: OPERATION_TYPE.CREATE,
      status: OPERATION_STATUS.SUCCESS,
      data: { id: result.id },
    });
  } catch (error) {
    LeeLogger.error('创建失败', error as Error, {
      operation: OPERATION_TYPE.CREATE,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};

// 更新
const handleUpdate = async (id: string, data: any) => {
  try {
    await updateAPI(id, data);
    LeeLogger.info('更新成功', {
      operation: OPERATION_TYPE.UPDATE,
      status: OPERATION_STATUS.SUCCESS,
      data: { id },
    });
  } catch (error) {
    LeeLogger.error('更新失败', error as Error, {
      operation: OPERATION_TYPE.UPDATE,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};

// 删除
const handleDelete = async (id: string) => {
  try {
    await deleteAPI(id);
    LeeLogger.info('删除成功', {
      operation: OPERATION_TYPE.DELETE,
      status: OPERATION_STATUS.SUCCESS,
      data: { id },
    });
  } catch (error) {
    LeeLogger.error('删除失败', error as Error, {
      operation: OPERATION_TYPE.DELETE,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};
\`\`\`

### 4.5 批量操作

\`\`\`typescript
const handleBatchDelete = async (ids: string[]) => {
  try {
    await batchDeleteAPI(ids);
    LeeLogger.info('批量删除成功', {
      operation: OPERATION_TYPE.BATCH_DELETE,
      status: OPERATION_STATUS.SUCCESS,
      data: { count: ids.length, ids },
    });
  } catch (error) {
    LeeLogger.error('批量删除失败', error as Error, {
      operation: OPERATION_TYPE.BATCH_DELETE,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};
\`\`\`

### 4.6 导入导出

\`\`\`typescript
// 导出
const handleExport = async () => {
  try {
    const result = await exportAPI();
    LeeLogger.info('数据导出成功', {
      operation: OPERATION_TYPE.EXPORT,
      status: OPERATION_STATUS.SUCCESS,
      data: { fileName: result.fileName, size: result.size },
    });
  } catch (error) {
    LeeLogger.error('数据导出失败', error as Error, {
      operation: OPERATION_TYPE.EXPORT,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};

// 导入
const handleImport = async (file: File) => {
  try {
    const result = await importAPI(file);
    LeeLogger.info('数据导入成功', {
      operation: OPERATION_TYPE.IMPORT,
      status: OPERATION_STATUS.SUCCESS,
      data: { count: result.count },
    });
  } catch (error) {
    LeeLogger.error('数据导入失败', error as Error, {
      operation: OPERATION_TYPE.IMPORT,
      status: OPERATION_STATUS.FAILURE,
    });
  }
};
\`\`\`

---

## 📊 五、日志管理

### 5.1 获取日志

\`\`\`typescript
// 获取所有日志
const logs = LeeLogger.getLogs();
console.log('日志总数:', logs.length);
\`\`\`

### 5.2 筛选日志

\`\`\`typescript
// 按级别筛选
const errorLogs = LeeLogger.filterLogs({
  level: LOG_LEVEL.ERROR,
});

// 按模块筛选
const userModuleLogs = LeeLogger.filterLogs({
  module: '用户管理',
});

// 按操作筛选
const loginLogs = LeeLogger.filterLogs({
  operation: OPERATION_TYPE.LOGIN,
});

// 按时间范围筛选
const recentLogs = LeeLogger.filterLogs({
  startTime: Date.now() - 86400000,  // 最近24小时
  endTime: Date.now(),
});

// 按用户筛选
const userLogs = LeeLogger.filterLogs({
  userName: '张三',
  userId: '123',
});

// 组合筛选
const complexLogs = LeeLogger.filterLogs({
  level: LOG_LEVEL.ERROR,
  module: '用户管理',
  startTime: Date.now() - 86400000,
  endTime: Date.now(),
});
\`\`\`

### 5.3 导出日志

\`\`\`typescript
// 导出为 JSON 格式
LeeLogger.downloadLogs('json');

// 导出为 TXT 格式
LeeLogger.downloadLogs('text');

// 获取 JSON 字符串（不下载）
const jsonString = LeeLogger.exportLogsAsJSON();

// 获取文本字符串（不下载）
const textString = LeeLogger.exportLogsAsText();
\`\`\`

### 5.4 删除日志

\`\`\`typescript
// 删除指定日志（通过时间戳）
const logsToDelete = LeeLogger.filterLogs({ level: LOG_LEVEL.DEBUG });
const timestamps = logsToDelete.map(log => log.timestamp);
LeeLogger.deleteLogs(timestamps);

// 清空所有日志
LeeLogger.clearLogs();
\`\`\`

---

## 🎨 六、常量定义

### 6.1 日志级别 (LOG_LEVEL)

\`\`\`typescript
const LOG_LEVEL = {
  DEBUG: "debug",    // 调试信息
  INFO: "info",      // 一般信息
  WARN: "warn",      // 警告信息
  ERROR: "error",    // 错误信息
  FATAL: "fatal",    // 严重错误
} as const;
\`\`\`

**级别优先级**: DEBUG < INFO < WARN < ERROR < FATAL

**使用建议**:
- \`DEBUG\` - 开发调试时使用，打印变量值、执行流程
- \`INFO\` - 记录业务信息，如用户操作、业务流程
- \`WARN\` - 警告信息，如资源不足、即将过期
- \`ERROR\` - 可恢复错误，如请求失败、验证失败
- \`FATAL\` - 不可恢复错误，如系统崩溃、严重异常

### 6.2 操作类型 (OPERATION_TYPE)

\`\`\`typescript
const OPERATION_TYPE = {
  // 用户认证相关
  LOGIN: "登录",
  LOGOUT: "登出",
  REGISTER: "注册",

  // CRUD 操作
  CREATE: "新增",
  READ: "查询",
  UPDATE: "更新",
  DELETE: "删除",

  // 批量操作
  BATCH_CREATE: "批量新增",
  BATCH_UPDATE: "批量更新",
  BATCH_DELETE: "批量删除",

  // 搜索与筛选
  SEARCH: "搜索",
  FILTER: "筛选",

  // 导入导出
  IMPORT: "导入",
  EXPORT: "导出",
  DOWNLOAD: "下载",
  UPLOAD: "上传",

  // 其他操作
  REFRESH: "刷新",
  RESET: "重置",
  SUBMIT: "提交",
  APPROVE: "审批",
  REJECT: "拒绝",
} as const;
\`\`\`

### 6.3 操作状态 (OPERATION_STATUS)

\`\`\`typescript
const OPERATION_STATUS = {
  SUCCESS: "成功",
  FAILURE: "失败",
  PENDING: "进行中",
} as const;
\`\`\`

---

## 📐 七、数据结构

### 7.1 日志记录接口 (LogRecord)

\`\`\`typescript
interface LogRecord {
  /** 时间戳 (毫秒) */
  timestamp: number;
  
  /** 创建时间 (格式: yyyy-mm-dd hh:mm:ss) */
  createTime: string;
  
  /** 日志级别 */
  level: LogLevel;
  
  /** 日志信息 */
  message: string;
  
  /** 操作用户 */
  userName?: string;
  
  /** 操作用户ID */
  userId?: string;
  
  /** 执行操作 */
  operation?: OperationType | string;
  
  /** 所在模块 */
  module?: string;
  
  /** 操作IP地址 */
  ip?: string;
  
  /** 计算机信息 */
  computer?: ComputerInfo;
  
  /** 操作状态 */
  status?: OperationStatus;
  
  /** 额外数据 */
  data?: any;
  
  /** 错误堆栈(仅错误日志) */
  stack?: string;
}
\`\`\`

### 7.2 计算机信息接口 (ComputerInfo)

\`\`\`typescript
interface ComputerInfo {
  /** 操作系统 */
  os?: string;
  
  /** 浏览器 */
  browser?: string;
  
  /** 浏览器版本 */
  browserVersion?: string;
  
  /** 屏幕分辨率 */
  screenResolution?: string;
  
  /** 用户代理 */
  userAgent?: string;
}
\`\`\`

### 7.3 日志记录示例

\`\`\`json
{
  "timestamp": 1706515200000,
  "createTime": "2026-01-29 14:00:00",
  "level": "info",
  "message": "用户登录成功",
  "userName": "张三",
  "userId": "123",
  "operation": "登录",
  "module": "用户管理",
  "ip": "192.168.1.100",
  "computer": {
    "os": "MacOS",
    "browser": "Chrome",
    "browserVersion": "120",
    "screenResolution": "1920x1080",
    "userAgent": "Mozilla/5.0..."
  },
  "status": "成功",
  "data": {
    "loginTime": "2026-01-29T14:00:00.000Z"
  }
}
\`\`\`

---

## 🔍 八、核心方法

### 8.1 初始化方法

\`\`\`typescript
// 初始化日志系统
LeeLogger.init(options: LoggerInitOptions): void

// 设置日志级别
LeeLogger.setLevel(level: LogLevel): void

// 设置当前用户
LeeLogger.setCurrentUser(userName: string, userId: string): void

// 清除当前用户（重置为默认用户）
LeeLogger.clearCurrentUser(): void

// 设置当前路由
LeeLogger.setCurrentRoute(route: string): void
\`\`\`

### 8.2 日志记录方法

\`\`\`typescript
// 通用日志记录
LeeLogger.log(params: CreateLogParams): void

// 便捷方法
LeeLogger.debug(message: string, data?: any): void
LeeLogger.info(message: string, data?: any): void
LeeLogger.warn(message: string, data?: any): void
LeeLogger.error(message: string, error?: Error, data?: any): void
LeeLogger.fatal(message: string, error?: Error, data?: any): void
\`\`\`

### 8.3 日志管理方法

\`\`\`typescript
// 获取所有日志
LeeLogger.getLogs(): LogRecord[]

// 筛选日志
LeeLogger.filterLogs(filter: FilterOptions): LogRecord[]

// 删除指定日志
LeeLogger.deleteLogs(timestamps: number[]): void

// 清空所有日志
LeeLogger.clearLogs(): void

// 导出日志为 JSON
LeeLogger.exportLogsAsJSON(): string

// 导出日志为文本
LeeLogger.exportLogsAsText(): string

// 下载日志文件
LeeLogger.downloadLogs(format: 'json' | 'text'): void
\`\`\`

---

## ⚙️ 九、高级特性

### 9.1 自动上下文采集

LeeLogger 会自动采集以下上下文信息：

#### 9.1.1 用户信息
- **默认值**: \`userName: "神秘小李"\`, \`userId: "9527"\`
- **更新方式**: 
  - 通过 \`init()\` 配置
  - 通过 \`setCurrentUser()\` 动态更新
  - 监听 Zustand store 变化自动更新

#### 9.1.2 路由信息
- **自动映射**: 根据路由路径自动推断模块名
- **映射规则**:
  1. 优先使用路由配置中的 \`meta.title\`
  2. 其次使用路由的 \`name\`
  3. 最后从路径提取并格式化

**示例**:
\`\`\`typescript
// 路由配置
{
  path: '/user-management',
  name: 'UserManagement',
  meta: { title: '用户管理' }
}

// 自动推断模块名: "用户管理"
\`\`\`

#### 9.1.3 IP 地址
- **获取方式**: 通过 WebRTC 自动获取局域网 IP
- **异步获取**: 不阻塞主流程
- **缓存机制**: 获取一次后缓存，避免重复获取
- **超时时间**: 3 秒
- **失败处理**: 静默失败，不影响日志记录

#### 9.1.4 计算机信息
- **操作系统**: Windows/MacOS/Linux/Android/iOS
- **浏览器**: Chrome/Safari/Firefox/Edge
- **浏览器版本**: 主版本号
- **屏幕分辨率**: 如 \`1920x1080\`
- **User Agent**: 完整的 UA 字符串

### 9.2 日志级别过滤

\`\`\`typescript
// 设置日志级别为 WARN
LeeLogger.setLevel(LOG_LEVEL.WARN);

// 只会输出 WARN、ERROR、FATAL 级别的日志
LeeLogger.debug('这条不会输出');  // ❌ 被过滤
LeeLogger.info('这条不会输出');   // ❌ 被过滤
LeeLogger.warn('这条会输出');     // ✅ 输出
LeeLogger.error('这条会输出');    // ✅ 输出
LeeLogger.fatal('这条会输出');    // ✅ 输出
\`\`\`

### 9.3 装饰器高级用法

\`\`\`typescript
export class OrderService {
  // 同步方法
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '订单管理',
    operation: OPERATION_TYPE.READ,
  })
  getOrderById(orderId: string) {
    return orders.find(o => o.id === orderId);
  }

  // 异步方法
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: '订单管理',
    operation: OPERATION_TYPE.CREATE,
  })
  async createOrder(orderData: OrderData) {
    return await api.post('/orders', orderData);
  }

  // 自动捕获错误
  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    module: '订单管理',
    operation: OPERATION_TYPE.DELETE,
  })
  async deleteOrder(orderId: string) {
    // 如果抛出错误，装饰器会自动记录 ERROR 级别日志
    return await api.delete(\`/orders/\${orderId}\`);
  }
}
\`\`\`

**装饰器自动记录的内容**:
1. **方法调用前**: 记录方法名和参数
2. **方法成功**: 记录成功状态和返回值
3. **方法失败**: 记录失败状态和错误信息

---

## 📈 十、性能优化

### 10.1 优化策略

| 策略 | 说明 | 效果 |
|------|------|------|
| **懒加载 IP** | 首次记录日志时才获取 IP | 减少初始化时间 |
| **异步 IP 获取** | 不阻塞主流程 | 提升用户体验 |
| **日志数量限制** | 最多 1000 条 | 避免内存溢出 |
| **sessionStorage** | 会话级存储 | 关闭标签即释放 |
| **条件输出** | 根据级别过滤 | 减少控制台噪音 |
| **FIFO 策略** | 先进先出 | 保留最新日志 |

### 10.2 性能指标

- **初始化时间**: < 50ms
- **单次日志记录**: < 5ms
- **IP 获取时间**: < 200ms（异步，不阻塞）
- **存储开销**: ~100KB（1000 条日志）
- **内存占用**: < 5MB

### 10.3 生产环境配置建议

\`\`\`typescript
// 生产环境建议配置
LeeLogger.init({
  routes: route,
  level: LOG_LEVEL.WARN,      // 只记录 WARN 及以上级别
  consoleEnabled: false,       // 禁用控制台输出
  autoGetIP: false,            // 禁用 IP 获取（减少性能开销）
});
\`\`\`

---

## 🔒 十一、安全性考虑

### 11.1 数据安全

1. **敏感信息过滤**: 不记录密码、token 等敏感数据
2. **本地存储**: 仅存储于客户端，不上传服务器
3. **会话隔离**: sessionStorage 保证标签页隔离
4. **自动清除**: 关闭标签页后自动清除日志

### 11.2 安全建议

\`\`\`typescript
// ❌ 错误示例 - 记录敏感信息
LeeLogger.info('用户登录', { 
  username: 'admin',
  password: '123456',  // 不要记录密码！
  token: 'xxx'         // 不要记录 token！
});

// ✅ 正确示例 - 过滤敏感信息
LeeLogger.info('用户登录', { 
  username: 'admin',
  loginTime: new Date().toISOString()
});
\`\`\`

---

## 📚 十二、最佳实践

### 12.1 日志级别使用建议

| 级别 | 使用场景 | 示例 |
|------|----------|------|
| DEBUG | 开发调试 | 打印变量值、执行流程 |
| INFO | 业务信息 | 用户操作、业务流程 |
| WARN | 警告信息 | 资源不足、即将过期 |
| ERROR | 可恢复错误 | 请求失败、验证失败 |
| FATAL | 不可恢复错误 | 系统崩溃、严重异常 |

### 12.2 日志消息规范

\`\`\`typescript
// ✅ 好的日志消息
LeeLogger.info('用户登录成功', { 
  userId: '123', 
  loginTime: new Date() 
});

LeeLogger.error('订单创建失败', error, { 
  orderId: '456' 
});

// ❌ 不好的日志消息
LeeLogger.info('成功');        // 太简略，缺少上下文
LeeLogger.error('error');      // 无意义，无法定位问题
\`\`\`

### 12.3 何时使用装饰器

**推荐使用装饰器的场景**:
- ✅ Service 层方法
- ✅ API 请求方法
- ✅ 关键业务方法
- ✅ 需要统一日志格式的方法

**不推荐使用装饰器的场景**:
- ❌ 简单的工具函数
- ❌ 高频调用的方法（如渲染函数）
- ❌ 需要自定义日志内容的场景

### 12.4 模块名称规范

\`\`\`typescript
// ✅ 好的模块名
module: '用户管理'
module: '订单管理'
module: '权限管理'

// ❌ 不好的模块名
module: 'user'              // 使用中文
module: '用户管理模块页面'   // 太长
\`\`\`

---

## 🧪 十三、测试建议

### 13.1 单元测试示例

\`\`\`typescript
import { LeeLogger, LOG_LEVEL } from '@/layout/utils/leeLogger';

describe('LeeLogger', () => {
  beforeEach(() => {
    LeeLogger.clearLogs();
  });

  test('应该正确初始化', () => {
    LeeLogger.init({ routes: mockRoutes });
    const logs = LeeLogger.getLogs();
    expect(logs.length).toBeGreaterThan(0);
  });

  test('应该正确记录日志', () => {
    LeeLogger.info('测试消息');
    const logs = LeeLogger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('测试消息');
    expect(logs[0].level).toBe('info');
  });

  test('应该正确过滤日志', () => {
    LeeLogger.info('Info');
    LeeLogger.error('Error');
    const errorLogs = LeeLogger.filterLogs({ level: LOG_LEVEL.ERROR });
    expect(errorLogs).toHaveLength(1);
    expect(errorLogs[0].message).toBe('Error');
  });

  test('应该正确设置用户信息', () => {
    LeeLogger.setCurrentUser('张三', '123');
    LeeLogger.info('测试');
    const logs = LeeLogger.getLogs();
    expect(logs[0].userName).toBe('张三');
    expect(logs[0].userId).toBe('123');
  });
});
\`\`\`

---

## 🔄 十四、版本演进

### 14.1 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v3.0.0 | 2026-01-29 | 重构文档结构，优化使用示例 |
| v2.3.0 | 2026-01-28 | 完善装饰器支持，优化性能 |
| v2.0.0 | 2026-01-20 | 重构核心架构，支持 Stage 3 装饰器 |
| v1.0.0 | 2026-01-10 | 初始版本发布 |

### 14.2 未来规划

- [ ] 支持日志上报到服务器
- [ ] 支持自定义存储引擎（localStorage/IndexedDB）
- [ ] 支持日志加密
- [ ] 支持日志压缩
- [ ] 支持日志分析和可视化
- [ ] 支持 SourceMap 映射

---

## 📞 十五、常见问题

### Q1: 为什么日志没有记录？

**A**: 检查以下几点：
1. 是否调用了 \`LeeLogger.init()\`
2. 日志级别是否正确（如设置为 WARN，则 DEBUG/INFO 不会记录）
3. 是否超过 1000 条限制（旧日志会被自动删除）

### Q2: 如何在生产环境禁用日志？

**A**: 设置日志级别为 FATAL 或禁用控制台输出：
\`\`\`typescript
LeeLogger.init({
  level: LOG_LEVEL.FATAL,
  consoleEnabled: false,
});
\`\`\`

### Q3: 装饰器不生效怎么办？

**A**: 确认 vite.config.ts 中已配置装饰器支持（参考 2.2 节）

### Q4: 如何清除所有日志？

**A**: 调用 \`LeeLogger.clearLogs()\`

### Q5: 日志存储在哪里？

**A**: 存储在 sessionStorage 中，key 为 \`react19_ts_app_{mode}_logs\`

### Q6: 装饰器报错 "Uncaught SyntaxError: Invalid or unexpected token" 怎么办？

**问题描述**: 浏览器无法识别 \`@\` 符号，导致语法错误

**原因分析**:
- TypeScript 装饰器语法没有被正确转译
- 使用了旧版装饰器配置（experimentalDecorators: true）
- Vite 的 esbuild 配置不正确

**解决方案**:

本项目使用 **Stage 3 装饰器**（新标准），配置如下：

\`\`\`typescript
// vite.config.ts（正确配置）
export default defineConfig({
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: false,  // ✅ 使用新版装饰器
        useDefineForClassFields: true,
      },
    },
  },
});
\`\`\`

**如果使用旧版装饰器**（不推荐）:

\`\`\`typescript
// vite.config.ts（旧版配置）
export default defineConfig({
  esbuild: {
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,  // ⚠️ 旧版装饰器
      },
    },
  },
});
\`\`\`

\`\`\`json
// tsconfig.app.json（旧版配置）
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
\`\`\`

**注意**: 
- ✅ 推荐使用 Stage 3 装饰器（新标准）
- ⚠️ 旧版装饰器已过时，不建议使用
- 🔧 如果遇到装饰器问题，请检查 vite.config.ts 配置

---

## 📄 十六、API 参考

### 导出内容

\`\`\`typescript
// 类型
export type {
  LogLevel,
  OperationType,
  OperationStatus,
  LogRecord,
  CreateLogParams,
  ComputerInfo,
};

// 常量
export {
  LOG_LEVEL,
  OPERATION_TYPE,
  OPERATION_STATUS,
};

// 类和装饰器
export {
  LeeLogger,
  LeeLoggerMethod,
};
\`\`\`

---

## 📝 十七、总结

LeeLogger 是一个功能完善、易于使用的企业级前端日志系统，具有以下特点：

✅ **开箱即用** - 简单配置即可使用  
✅ **功能强大** - 支持多级别、装饰器、自动上下文采集  
✅ **性能优异** - 异步处理、内存优化、不影响主流程  
✅ **类型安全** - 完整的 TypeScript 类型定义  
✅ **易于维护** - 清晰的代码结构、完善的文档

通过合理使用 LeeLogger，可以有效提升应用的可维护性、可调试性和用户体验。

---

**文档结束**
`;export{n as default};
