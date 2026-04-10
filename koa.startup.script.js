/**
 * koa服务启动命令脚本
 *
 * @format
 */

import { spawn } from "child_process";

function run(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    console.log(`\n[${name}] exited with code ${code}`);
    process.exit(code ?? 0);
  });

  return child;
}

// 启动前端 npm run mock
const web = run("WEB", "npm", ["run", "dev:koa"]);

// 启动 koa npm run koa
const koa = run("KOA", "npm", ["--prefix", "koa-server", "run", "koa"]);

// 统一关闭逻辑
function shutdown() {
  console.log("\n🛑 koa服务统一关闭逻辑 shutting down...");

  web.kill();
  koa.kill();

  process.exit();
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown);
