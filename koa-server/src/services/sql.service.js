// src/services/sql.service.ts
import { getDatabase } from './database.service';

export class SQLService {
  // 执行原始 SQL 查询
  static async executeQuery(query: string, params: any[] = []): Promise<any> {
    const db = await getDatabase();
    
    // 简单的 SQL 注入防护 - 检查是否包含危险关键字
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER', 'TRUNCATE'];
    const upperQuery = query.toUpperCase();
    
    // 仅允许 SELECT 查询
    if (!upperQuery.trim().startsWith('SELECT')) {
      throw new Error('Only SELECT queries are allowed for security reasons');
    }
    
    // 检查是否包含危险关键字
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword) && !upperQuery.trim().startsWith(keyword)) {
        throw new Error(`Query contains dangerous keyword: ${keyword}`);
      }
    }
    
    try {
      if (query.trim().toUpperCase().startsWith('SELECT')) {
        const result = await db.all(query, ...params);
        return result;
      } else {
        throw new Error('Only SELECT queries are allowed');
      }
    } catch (error) {
      throw new Error(`Query execution failed: ${(error as Error).message}`);
    }
  }
  
  // 获取所有表名
  static async getTableNames(): Promise<string[]> {
    const db = await getDatabase();
    const result = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    return result.map((row: any) => row.name);
  }
  
  // 获取表结构信息
  static async getTableSchema(tableName: string): Promise<any[]> {
    const db = await getDatabase();
    return await db.all(`PRAGMA table_info(${tableName})`);
  }
  
  // 获取表数据预览
  static async getTablePreview(tableName: string, limit: number = 10): Promise<any[]> {
    const db = await getDatabase();
    return await db.all(`SELECT * FROM ${tableName} LIMIT ${limit}`);
  }
}