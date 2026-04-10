/** @format */
import Koa from "koa";
import fs from "fs";
import { networkInterfaces } from "os";
import { config } from "dotenv";
import { exec } from "child_process";
import chalk from "chalk";

// 根据 NODE_ENV 加载对应的环境变量文件
const env = process.env.NODE_ENV || "development";
const envPath = `.env.${env}`;

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.log(`Environment file ${envPath} not found, using default values`);
}

const app = new Koa();

app.use(async (ctx) => {
  if (ctx.path === "/api/user") {
    ctx.body = {
      code: 0,
      data: {
        name: "mock用户",
        age: 25,
      },
    };
  } else {
    ctx.body = "Koa mock server running";
  }
});

// 优先使用 PORT 环境变量，否则使用 3000 端口
const PORT = parseInt(process.env.PORT || "3000", 10);
// 本地地址
const localUrl = `http://localhost:${PORT}`;
/**
 * 启动后自动在浏览器中打开
 * @param {*} url 网址
 */
function openBrowser(url) {
  const platform = process.platform;

  let command = "";

  if (platform === "darwin") {
    command = `open "${url}"`;
  } else if (platform === "win32") {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.error("自动打开浏览器失败：", error.message);
    }
  });
}

app.listen(PORT, () => {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    const netInterface = nets[name];
    if (netInterface) {
      for (const net of netInterface) {
        // 跳过内部地址和IPv6地址
        if (!net.internal && net.family === "IPv4") {
          results.push(`http://${net.address}:${PORT}`);
        }
      }
    }
  }

  console.log("=====================================================");
  console.log(`${chalk.green("| > ")} 🚀 Koa Server is running!`);
  console.log(`${chalk.green("| > ")} 📍 Local: ${chalk.blue(localUrl)}`);
  console.log(
    `${chalk.green("| > ")} 📊 SQL Tool: ${chalk.blue(localUrl + "/sql-tool.html")}`
  );
  if (results.length > 0) {
    console.log(`${chalk.green("| > ")} 📡 Network: ${chalk.blue(results[0])}`);
  }
  console.log("=====================================================");

  // 打开浏览器，选择网址打开
  openBrowser(localUrl);
});
