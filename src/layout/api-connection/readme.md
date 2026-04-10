# API连接配置

主要用于，对不同后台服务的基础接口进行对接，处理每次项目更换后台服务的情况
使当前框架不局限于单个后台服务风格，可与不同的后台服务进行快速对接

## 涉及目录及文件
> 每更换后台服务时均涉及到更新接口配置时
1、src/store/user.ts
2、src/layout/utils/request.ts
3、src/layout/api-connection
4、src/config/react19_ts_config.json
5、src/pages/sso-loading/index.tsx    =>    transformRoutes数据转换

## 目录结构

- `koa-api-connection`: koa后台服务连接配置
- `fast-api-connection`: fastapi后台服务连接配置

## 使用方法

```typescript
import apiConnection from "@/api-connection";

  // 登录
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGIN,
  })
  login(params: LoginInfo) {
    return $post(apiConnection.login.login.path, params, {
      transformParams: apiConnection.login.login.transformParams,
      transformResponse: apiConnection.login.login.transformResponse,
    });
  }
```