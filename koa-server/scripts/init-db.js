/** @format */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// mock/scripts/init-db.js 的“mock 根目录”是上一级目录
const mockRoot = path.resolve(__dirname, "..");

const dbPath = path.join(mockRoot, "db_sqlite", "database.sqlite");
const initSqlPath = path.join(
  mockRoot,
  "db_sqlite",
  "backups",
  "sql",
  "init-db-main.sqlite.sql"
);

const FORCE = process.argv.includes("--force");
// 有则跳过：若库文件存在，且表结构标记存在则直接 return
const SKIP_IF_EXISTS = !FORCE;

async function isDbInitialized(dbFile) {
  // 用一个核心业务表作为“已初始化”标记
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });
  try {
    const row = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='sys_user' LIMIT 1"
    );
    return Boolean(row?.name);
  } finally {
    await db.close();
  }
}

async function main() {
  console.log("🚀 初始化数据库...");

  const dbFileExists = fs.existsSync(dbPath);
  if (SKIP_IF_EXISTS && dbFileExists) {
    try {
      const initialized = await isDbInitialized(dbPath);
      if (initialized) {
        console.log("✅ 数据库已初始化，跳过");
        return;
      }
      console.log("⚠️ 数据库已存在但未初始化，继续初始化");
    } catch (e) {
      console.warn("⚠️ 数据库状态检查失败，将尝试重新初始化：", e);
    }
  }

  if (!fs.existsSync(initSqlPath)) {
    throw new Error(`初始化脚本不存在: ${initSqlPath}`);
  }

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sql = fs.readFileSync(initSqlPath, "utf-8");
  console.log("准备执行数据库初始化脚本...");

  // SQLite 的 sqlite_sequence 是内部保留对象，不能 DROP/CREATE/INSERT。
  // 该 SQL 备份文件来自 Navicat 导出，包含了 sqlite_sequence 初始化块。
  // 这里在执行前移除所有包含 sqlite_sequence 的行，避免 SQLITE_ERROR。
  const sanitizedSql = sql
    .split(/\r?\n/)
    .filter((line) => !line.includes("sqlite_sequence"))
    .join("\n");

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  try {
    await db.exec(sanitizedSql);
  } finally {
    await db.close();
  }

  console.log("✅ 数据库初始化成功");
}

main().catch((err) => {
  console.error("❌ 数据库初始化失败:", err);
  process.exitCode = 1;
});
