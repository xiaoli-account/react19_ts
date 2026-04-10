/** @format */

import { SQLService } from "../services/sql.service";

export class SQLController {
  // 执行 SQL 查询
  static executeQuery = async (ctx) => {
    try {
      const { query, params = [] } = ctx.request.body;

      if (!query) {
        ctx.status = 400;
        ctx.body = { message: "Query is required" };
        return;
      }

      const result = await SQLService.executeQuery(query, params);

      ctx.body = {
        success: true,
        data: result,
        query,
        params,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message,
        error: error.message,
      };
    }
  };

  // 获取所有表名
  static getTables = async (ctx) => {
    try {
      const tables = await SQLService.getTableNames();

      ctx.body = {
        success: true,
        data: tables,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Failed to fetch tables",
        error: error.message,
      };
    }
  };

  // 获取表结构信息
  static getTableSchema = async (ctx) => {
    try {
      const { tableName } = ctx.params;

      if (!tableName) {
        ctx.status = 400;
        ctx.body = { message: "Table name is required" };
        return;
      }

      const schema = await SQLService.getTableSchema(tableName);

      ctx.body = {
        success: true,
        data: schema,
        tableName,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Failed to fetch table schema",
        error: error.message,
      };
    }
  };

  // 获取表数据预览
  static getTablePreview = async (ctx) => {
    try {
      const { tableName } = ctx.params;
      const { limit = 10 } = ctx.query;

      if (!tableName) {
        ctx.status = 400;
        ctx.body = { message: "Table name is required" };
        return;
      }

      const data = await SQLService.getTablePreview(tableName, parseInt(limit));

      ctx.body = {
        success: true,
        data,
        tableName,
        limit: parseInt(limit),
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Failed to fetch table preview",
        error: error.message,
      };
    }
  };
}
