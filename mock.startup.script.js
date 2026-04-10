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
  console.log("\n🛑 mock服务统一关闭...");

  web.kill();
  console.log("\n🛑 web服务已关闭...");
  mockjs.kill();
  console.log("\n🛑 mockjs服务已关闭...");

  console.log("\n🛑 进程已退出...");
  process.exit();
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown);
