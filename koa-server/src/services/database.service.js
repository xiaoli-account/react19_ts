/** @format */

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// 打开数据库连接
export async function openDatabase() {
  // 确保数据库目录存在
  const fs = await import("fs");
  const path = await import("path");

  const dbDir = "./db_sqlite";
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return open({
    filename: "./db_sqlite/database.sqlite",
    driver: sqlite3.Database,
  });
}

// 初始化数据库表
export async function initializeDatabase() {
  const db = await openDatabase();

  // 创建用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      username TEXT,
      nickname TEXT,
      avatar TEXT,
      phone TEXT,
      roles TEXT,
      loginName TEXT,
      imgUrl TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建产品表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建登录用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS login_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建Studio Apps表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS studio_apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      createBy TEXT NOT NULL,
      createDate TEXT NOT NULL,
      updateDate TEXT NOT NULL,
      mode TEXT NOT NULL
    )
  `);

  // 创建Chatflow Conversations表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS chatflow_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appId TEXT NOT NULL,
      appName TEXT NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  // 创建Chatflow Messages表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS chatflow_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversationId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // 创建Workflow Execution Logs表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS workflow_execution_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appId TEXT NOT NULL,
      appName TEXT NOT NULL,
      workflowId TEXT NOT NULL,
      workflowName TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  // 创建Workflow Apps表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS workflow_apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      json TEXT NOT NULL
    )
  `);

  // 创建Files表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      uploadTime TEXT,
      businessId TEXT
    )
  `);

  // 创建Knowledge Bases表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_bases (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      fileCount INTEGER DEFAULT 0,
      createBy TEXT NOT NULL,
      createDate TEXT NOT NULL,
      updateDate TEXT NOT NULL
    )
  `);

  // 创建Knowledge Base Files表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_base_files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      uploadTime TEXT,
      knowledgeBaseId TEXT NOT NULL
    )
  `);

  await db.close();
}

// 初始化示例数据
export async function initializeSampleData() {
  const db = await openDatabase();

  // 检查是否已存在用户数据，如果不存在则创建示例数据
  const userExists = await db.get("SELECT COUNT(*) as count FROM users");
  if (userExists.count === 0) {
    // 创建示例用户
    await db.run(
      "INSERT INTO users (name, email, username, nickname, avatar, phone, roles, loginName, imgUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      "张三",
      "zhangsan@example.com",
      "zhangsan",
      "张三",
      "",
      "13800138000",
      JSON.stringify(["user"]),
      "zhangsan",
      ""
    );

    await db.run(
      "INSERT INTO users (name, email, username, nickname, avatar, phone, roles, loginName, imgUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      "李四",
      "lisi@example.com",
      "lisi",
      "李四",
      "",
      "13800138001",
      JSON.stringify(["admin"]),
      "lisi",
      ""
    );
  }

  await db.close();
}

// 获取数据库实例（单例模式）
let databaseInstance = null;

export async function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = await openDatabase();
  }
  return databaseInstance;
}
