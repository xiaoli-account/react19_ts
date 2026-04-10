# mock服务搭建配置
	
	被后端卡脖子的事很难过，所以我需要一个可以在不依赖后台服务时自由开发的服务，这个时候我选择了mockjs
	通过nodejs弄一个mock服务，使用nodejs框架Express，于是我达到了快速运行前端并开发的水平
	但是我在实际使用时发现，他并不能达到我想要的效果，于是我准备在下一阶段学习nodejs的koa框架搭建一个真真正正的后台服务，达到以假乱真的效果

## 五分钟集成进入项目

### 目录新建
- 1、在项目目录新建目录mock
- 2、根据以下目录结构进行新建
```
mock
├── app.js
├── config
│   ├── api-url.js
│   └── response.js
├── module
│   ├── index.js
│   └── login.js
├── package.json
└── readme.md
```
- 3、共需关注六个文件的代码即可启动分别是如下：
```json
// mock/package.json
{
  "name": "mock",
  "version": "1.0.0",
  "scripts": {
    "mock": "node app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mockjs": "^1.1.0"
  }
}
```

```js
// mock/config/api-url.js
/** @format */

/**
 * 统一管理接口请求统一前缀，如“/api”
 */
export const API_BEFORE_URL = "";
```

```js
// mock/config/response.js
/** @format */

/**
 * 统一管理接口返回格式
 */
export const success200 = {
  code: 200,
  message: "success",
};
```

```js
// mock/app.js
/** @format */

const express = require("express");
const cors = require("cors");
const setupMock = require("./module");

const app = express();

app.use(cors());
app.use(express.json());

// 注册 mock
setupMock(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.warn(`Mock server running at http://localhost:${PORT}`);
});

```

```js
// mock/module/index.js
/** @format */

const Mock = require("mockjs");
const login = require("./login");

function registerMockModule(app, moduleArray) {
  moduleArray.forEach((module) => {
    module.forEach((item) => {
      Object.entries(item).forEach(([url, config]) => {
        const { method, response } = config;
        app[method](url, (req, res) => {
          const result =
            typeof response === "function"
              ? response(req)
              : Mock.mock(response);
          res.json(result);
        });
      });
    });
  });
}

function setupMock(app) {
  // 注册所有 mock 模块
  registerMockModule(app, [login]);
}

module.exports = setupMock;

```

```js
// mock/module/login.js
/** @format */

const Mock = require("mockjs");
const { success200 } = require("../config/response");
const { API_BEFORE_URL } = require("../config/api-url");

module.exports = [
  {
    [API_BEFORE_URL + "/login"]: {
      method: "post",
      response: (req) => ({
        ...success200,
        data: Mock.mock("@guid"),
      }),
    },
    [API_BEFORE_URL + "/getUserInfo"]: {
      method: "get",
      response: (req) => ({
        ...success200,
        data: Mock.mock({
          id: "@id",
          loginName: "@word(5, 10)",
          name: "@cname",
          phone: /^1[3-9]\d{9}$/,
          email: "@email",
          avatar: "@image('100x100', '#50B347', '#FFF', 'Avatar')",
        }),
      }),
    },
    [API_BEFORE_URL + "/logout"]: {
      method: "post",
      response: (req) => ({
        ...success200,
        data: {
          message: Mock.mock("@sentence(3, 5)"),
        },
      }),
    },
  },
];

```
### 依赖安装
- 1、所需依赖共三个，分别为cors、express、mockjs
- 2、进入mock目录下，执行安装命令`npm install`
### 双服务启动脚本与配置
- 想要将前端项目与mock服务关联起来，一个命令启动，这个时候就需要一个js脚本
- 通过npm run mock ,同时启动前端与mock服务
- 查看下方具体脚本代码

```js
/**
 * mock服务启动命令脚本
 *
 * @format
 */

import { spawn } from "child_process";

function run(name, command) {
  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    console.log(`\n[${name}] exited with code ${code}`);
    process.exit(code ?? 0);
  });

  return child;
}

// 启动前端
const web = run("WEB", "npm run dev:mock");

// 启动 mockjs
const mockjs = run("mock", "npm --prefix mock run mock");

// 统一关闭逻辑
function shutdown() {
  console.log("\n🛑 mock服务统一关闭逻辑 shutting down...");

  web.kill();
  mockjs.kill();

  process.exit();
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown);

```
### 启动测试
- 1、mock单独启动,成功标识如下：
```bash
> mock@1.0.0 mock
> node app.js

Mock server running at http://localhost:3000
```
- 2、项目联合启动,成功标识如下：
```bash
lee@Mac-mini react19_ts % npm run mock

> react19_ts@0.0.1 mock
> node mock.startup.script.js


> react19_ts@0.0.1 dev:mock
> vite --mode mock


> mock@1.0.0 mock
> node app.js

Mock server running at http://localhost:3000
正在运行环境:mock
2026-03-27T00:32:35.103Z 读取mock环境变量: {
  VITE_APP_PORT: '4300',
  VITE_APP_TITLE: 'React TS Mock',
  VITE_API_BASE_URL: '/mock-api',
  VITE_SSE_BASE_URL: '/mock-sse',
  VITE_WS_BASE_URL: '/mock-ws',
  VITE_APP_COOKIE_DOMAIN: 'localhost',
  VITE_APP_API_URL: 'http://localhost:3000',
  VITE_APP_WS_ENDPOINT: 'wss://echo.websocket.org',
  VITE_APP_SSE_ENDPOINT: 'https://stream.wikimedia.org'
}

  VITE v7.3.1   mock   ready in 909 ms

  ➜  Local:   http://localhost:4300/
  ➜  Network: http://192.168.0.69:4300/
  ➜  Network: http://169.254.4.57:4300/
  ➜  press h + enter to show help

```

# 常见问题
- 1、接口mock完成，访问不到？
- 答：重新启动mock服务

# 创建日期：2026/03/26 14:29