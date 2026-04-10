/** @format */

import { sessionStorage } from "@/layout/utils/storage";

/**
 * 日志级别常量
 * 遵循国际标准日志级别定义
 * @example
 * LeeLogger.setLevel(LOG_LEVEL.WARN);
 */
const LOG_LEVEL = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
} as const;

/**
 * 日志类型常量
 */
const LOG_TYPE = {
  AJAX: "ajax",
  SSE: "sse",
  WEBSOCKET: "websocket",
  METHOD: "method",
  OTHER: "other",
} as const;

/**
 * 操作类型常量
 * 定义系统中常见的操作类型
 * @example
 * LeeLogger.createLog({ operation: OPERATION_TYPE.LOGIN, ... });
 */
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

/**
 * 操作状态常量
 */
const OPERATION_STATUS = {
  SUCCESS: "成功",
  FAILURE: "失败",
  PENDING: "进行中",
} as const;

/**
 * 默认用户信息
 */
const DEFAULT_USER = {
  userName: "神秘小李",
  userId: "9527",
};

/**
 * 请求元数据标识符
 * 用于在 Promise 对象上挂载请求详情(URL, 参数等),供日志系统识别
 */
const REQUEST_LOG_META = Symbol("REQUEST_LOG_META");
/**
 * SSE元数据标识符
 * 用于在 Promise 对象上挂载请求详情(URL, 参数等),供日志系统识别
 */
const SSE_LOG_META = Symbol("SSE_LOG_META");
/**
 * WebSocket元数据标识符
 * 用于在 Promise 对象上挂载请求详情(URL, 参数等),供日志系统识别
 */
const WEBSOCKET_LOG_META = Symbol("WEBSOCKET_LOG_META");

/**
 * 日志级别类型
 * 自动从 LOG_LEVEL 提取,避免重复定义
 */
type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

/**
 * 操作类型
 * 自动从 OPERATION_TYPE 提取
 */
type OperationType = (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE];

/**
 * 操作状态类型
 */
type OperationStatus = (typeof OPERATION_STATUS)[keyof typeof OPERATION_STATUS];

/**
 * 日志类型
 */
type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE];

/**
 * 计算机信息接口
 */
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

/**
 * 日志记录接口
 * 遵循国际标准的日志格式
 */
interface LogRecord {
  /** 唯一标识符 */
  id: string;
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
  /** 公网IP地址 */
  publicIP?: string;
  /** 局域网IP地址 */
  localIP?: string;
  /** 操作IP地址 (兼容性保留) */
  ip?: string;
  /** 计算机信息 */
  computer?: ComputerInfo;
  /** 操作状态 */
  status?: OperationStatus;
  /** 额外数据 */
  data?: any;
  /** 错误堆栈(仅错误日志) */
  stack?: string;
  /** 日志类型 */
  type?: LogType;
  /** 错误对象 */
  error?: Error;
}

/**
 * 创建日志参数接口
 */
interface CreateLogParams {
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
  /** 操作状态 */
  status?: OperationStatus;
  /** 额外数据 */
  data?: any;
  /** 错误对象 */
  error?: Error;
  /** 日志类型 */
  type?: LogType;
}

/**
 * 日志系统初始化配置接口
 */
interface LoggerInitOptions {
  /** 路由配置数组,用于构建路由-模块映射表 */
  routes?: any[];
  /** 日志级别 */
  level?: LogLevel;
  /** 是否启用控制台输出 */
  consoleEnabled?: boolean;
  /** 当前用户信息 */
  currentUser?: {
    userName: string;
    userId: string;
  };
  /** 是否自动获取IP */
  autoGetIP?: boolean;
  /** 局域网IP获取接口地址 */
  localIPApi?: string;
  /** 自定义初始化函数 */
  init?: () => void;
}

/**
 * 日志服务类
 * 提供完整的企业级日志管理功能
 */
class LeeLogger {
  /**
   * 默认日志级别
   */
  static level: LogLevel = LOG_LEVEL.DEBUG;

  /**
   * 是否输出到控制台
   */
  static consoleEnabled: boolean = true;

  /**
   * 最大日志数量限制
   */
  static readonly MAX_LOGS = 500;

  /**
   * 最大日志大小限制（5MB）
   */
  static readonly MAX_LOG_SIZE = 5 * 1024 * 1024;

  /**
   * 日志存储键名
   */
  static readonly LOG_STORAGE_KEY =
    "react19_ts_app_" + import.meta.env.MODE + "_logs";

  /**
   * 局域网IP获取接口
   */
  private static localIPApi: string = "http://localhost:8080/api/getLocalIp";

  /**
   * 当前用户信息缓存
   */
  private static currentUser: { userName?: string; userId?: string } = {
    userName: DEFAULT_USER.userName,
    userId: DEFAULT_USER.userId,
  };

  /**
   * 当前路由路径缓存
   */
  private static currentRoute: string = "";

  /**
   * 公网IP地址缓存
   */
  private static publicIP: string = "";

  /**
   * 局域网IP地址缓存
   */
  private static localIP: string = "";

  /**
   * IP获取状态
   */
  private static ipFetching: boolean = false;

  /**
   * 路由模块映射表
   */
  private static routeModuleMap: Record<string, string> = {};

  /**
   * 初始化状态
   */
  private static initialized: boolean = false;

  /**
   * 日志ID计数器（用于生成唯一ID）
   */
  private static logIdCounter: number = 0;

  /**
   * 初始化日志系统
   * @param options 初始化配置对象
   * @example
   * ```typescript
   * import { LeeLogger } from '@/layout/utils';
   * import routes from '@/router/routes';
   * import { useUserStore } from '@/store/user';
   *
   * LeeLogger.init({
   *   routes: route,
   *   level: LOG_LEVEL.INFO,
   *   consoleEnabled: true,
   *   currentUser: useUserStore.getState().userInfo
   *     ? {
   *         username: useUserStore.getState().userInfo.nickname,
   *         userid: useUserStore.getState().userInfo.id
   *       }
   *     : undefined,
   *   autoGetIP: true,
   * });
   * ```
   */
  static init(options: LoggerInitOptions = {}) {
    if (this.initialized) {
      console.warn("LeeLogger 已经初始化,请勿重复初始化");
      return;
    }

    // 1. 设置日志级别
    if (options.level) {
      this.level = options.level;
    }

    // 2. 设置控制台输出开关
    if (options.consoleEnabled !== undefined) {
      this.consoleEnabled = options.consoleEnabled;
    }

    // 3. 设置用户信息
    if (options.currentUser) {
      this.currentUser = {
        userName: options.currentUser.userName,
        userId: options.currentUser.userId,
      };
    }
    // 如果没有传入用户信息,保持默认的"神秘小李/9527"

    // 4. 从路由配置构建模块映射
    if (options.routes && Array.isArray(options.routes)) {
      this.buildRouteModuleMap(options.routes);
    }

    // 设置局域网 IP 接口地址
    if (options.localIPApi) {
      this.localIPApi = options.localIPApi;
    }

    // 5. 异步获取IP (默认开启,可通过配置关闭)
    if (options.autoGetIP !== false) {
      this.fetchIPInfo().catch(() => {
        // 静默失败,不影响初始化
      });
    }

    // 执行自定义初始化函数
    try {
      options.init?.();
    } catch (error) {
      console.error("自定义初始化函数执行失败", error);
      this.info("自定义初始化函数执行失败", error);
    }

    // 标记为已初始化
    this.initialized = true;

    // 记录初始化完成日志
    this.info("日志系统初始化完成", {
      level: this.level,
      consoleEnabled: this.consoleEnabled,
      user: this.currentUser,
      routeModuleMapCount: Object.keys(this.routeModuleMap).length,
      autoGetIP: options.autoGetIP !== false,
    });
  }

  /**
   * 从路由配置构建模块映射表
   * @param routes 路由配置数组
   * @param parentPath 父路径
   */
  private static buildRouteModuleMap(routes: any[], parentPath = "") {
    routes.forEach((route) => {
      let fullPath =
        parentPath +
        (route.path?.startsWith("/") ? "" : "/") +
        (route.path || "");

      // 统一处理双斜杠问题
      fullPath = fullPath.replace(/\/+/g, "/");

      // 如果有 meta.title,使用它作为模块名
      if (route.meta?.title) {
        this.routeModuleMap[fullPath] = route.meta.title;
      }
      // 如果有 name,作为备选
      else if (route.name) {
        this.routeModuleMap[fullPath] = route.name;
      }

      // 递归处理子路由
      if (route.children && Array.isArray(route.children)) {
        this.buildRouteModuleMap(route.children, fullPath);
      }
    });
  }

  /**
   * 设置日志级别
   * @param level 日志级别
   */
  static setLevel(level: LogLevel) {
    this.level = level;
  }

  /**
   * 设置当前用户信息
   * @param userName 用户名
   * @param userId 用户ID
   */
  static setCurrentUser(
    userName: string | undefined = DEFAULT_USER.userName,
    userId: string | undefined = DEFAULT_USER.userId
  ) {
    this.currentUser = { userName, userId };
    this.info("更新当前用户信息", { userName, userId });
  }

  /**
   * 清除当前用户信息(重置为默认值)
   */
  static clearCurrentUser() {
    this.currentUser = {
      userName: DEFAULT_USER.userName,
      userId: DEFAULT_USER.userId,
    };
    this.info("清除用户信息,重置为默认用户");
  }

  /**
   * 设置当前路由
   * @param route 路由路径
   */
  static setCurrentRoute(route: string) {
    this.currentRoute = route;
  }

  /**
   * 手动设置局域网 IP
   * @param ip IP 地址
   */
  static setLocalIP(ip: string) {
    this.localIP = ip;
    this.info("手动更新局域网IP", { ip });
  }

  /**
   * 根据路由路径自动推断模块名称
   * @param route 路由路径
   * @returns 模块名称
   */
  private static getModuleFromRoute(route: string): string {
    // 精确匹配
    if (this.routeModuleMap[route]) {
      return this.routeModuleMap[route];
    }

    // 模糊匹配 (匹配开头,找最长的匹配)
    let longestMatch = "";
    let moduleName = "";

    for (const [path, module] of Object.entries(this.routeModuleMap)) {
      if (route.startsWith(path) && path.length > longestMatch.length) {
        longestMatch = path;
        moduleName = module;
      }
    }

    if (moduleName) {
      return moduleName;
    }

    // 提取第一级路径作为模块名
    const parts = route.split("/").filter(Boolean);
    if (parts.length > 0) {
      // 将kebab-case转换为标题格式
      return parts[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return "未知模块";
  }

  /**
   * 获取并缓存 IP 信息（公网IP + 局域网IP）
   */
  private static async fetchIPInfo(): Promise<void> {
    if (this.ipFetching) return;
    this.ipFetching = true;

    try {
      await Promise.allSettled([this.fetchPublicIP(), this.fetchLocalIP()]);
    } finally {
      this.ipFetching = false;
    }
  }

  /**
   * 通过公网 API 获取公网 IP
   */
  private static async fetchPublicIP(): Promise<string> {
    if (this.publicIP) return this.publicIP;

    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      this.publicIP = data.ip || "localhost";
      return this.publicIP;
    } catch {
      this.publicIP = "localhost";
      return "localhost";
    }
  }

  /**
   * 获取局域网 IP (前端受限，使用 fetch 替代方案)
   */
  private static async fetchLocalIP(): Promise<string> {
    if (this.localIP) return this.localIP;

    try {
      // 优先从配置的接口地址获取
      const response = await fetch(this.localIPApi);
      if (response.ok) {
        const text = await response.text();
        try {
          // 尝试按 JSON 解析
          const data = JSON.parse(text);
          this.localIP = data.ip || data.address || text;
        } catch {
          // 解析失败则当做纯文本
          this.localIP = text.trim() || "localhost";
        }
      } else {
        // 接口不可用时，回退到基于 hostname 的推断逻辑
        this.localIP =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
            ? "127.0.0.1"
            : "localhost";
      }
      return this.localIP;
    } catch {
      // 接口请求失败时，回退到基于 hostname 的推断逻辑
      this.localIP =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
          ? "127.0.0.1"
          : "localhost";
      return this.localIP;
    }
  }

  /**
   * 获取计算机信息
   * @returns 计算机信息
   */
  private static getComputerInfo(): ComputerInfo {
    const ua = navigator.userAgent;

    // 解析操作系统
    let os = "Unknown";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "MacOS";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (ua.indexOf("Android") !== -1) os = "Android";
    else if (ua.indexOf("iOS") !== -1) os = "iOS";

    // 解析浏览器
    let browser = "Unknown";
    let browserVersion = "";

    if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Edg") === -1) {
      browser = "Chrome";
      const match = ua.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : "";
    } else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) {
      browser = "Safari";
      const match = ua.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : "";
    } else if (ua.indexOf("Firefox") !== -1) {
      browser = "Firefox";
      const match = ua.match(/Firefox\/(\d+)/);
      browserVersion = match ? match[1] : "";
    } else if (ua.indexOf("Edg") !== -1) {
      browser = "Edge";
      const match = ua.match(/Edg\/(\d+)/);
      browserVersion = match ? match[1] : "";
    }

    return {
      os,
      browser,
      browserVersion,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: ua,
    };
  }

  /**
   * 生成唯一的日志ID
   * 格式: timestamp-counter-random
   * @returns 唯一的日志ID
   */
  private static generateLogId(): string {
    const timestamp = Date.now();
    const counter = ++this.logIdCounter;
    const random = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${counter}-${random}`;
  }

  /**
   * 格式化时间
   * @param date 日期对象
   * @returns 格式化后的时间字符串 (yyyy-mm-dd hh:mm:ss)
   */
  private static formatTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 创建日志记录
   * @param params 日志参数
   * @returns 日志记录对象
   */
  static createLog(params: CreateLogParams): LogRecord {
    const now = new Date();
    const logRecord: LogRecord = {
      id: this.generateLogId(),
      timestamp: now.getTime(),
      createTime: this.formatTime(now),
      level: params.level,
      message: params.message,
      // 自动填充用户信息:优先使用传入的,否则使用缓存的
      userName: params.userName || this.currentUser.userName,
      userId: params.userId || this.currentUser.userId,
      operation: params.operation,
      // 自动填充模块:优先使用传入的,否则根据当前路由推断
      module:
        params.module ||
        (this.currentRoute
          ? this.getModuleFromRoute(this.currentRoute)
          : undefined),
      // 自动填充IP
      publicIP: this.publicIP || undefined,
      localIP: this.localIP || undefined,
      // 兼容性保留
      ip:
        [this.publicIP, this.localIP].filter(Boolean).join(" / ") || undefined,
      computer: this.getComputerInfo(),
      status: params.status,
      data: params.data,
      type: params.type,
      error: params.error,
    };

    // 如果IP尚未获取,异步获取(不阻塞日志记录)
    if ((!this.localIP || !this.publicIP) && !this.ipFetching) {
      this.fetchIPInfo().catch(() => {
        // 静默失败,不影响日志记录
      });
    }

    // 如果是错误日志且有错误对象,添加堆栈信息
    if (params.error && params.error.stack) {
      logRecord.stack = params.error.stack;
    }

    return logRecord;
  }

  /**
   * 判断是否应该输出日志
   * @a 定义了日志级别优先级: debug < info < warn < error < fatal
   * @b 只输出 大于或等于 当前设置级别的日志
   * @c 例如:设置 LeeLogService.level = LOG_LEVEL.WARN 后,只会输出 warn 和 error 级别的日志
   * @param level 日志级别
   * @returns 是否应该输出日志
   */
  static shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error", "fatal"];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  /**
   * 记录日志
   * @param params 日志参数
   */
  static log(params: CreateLogParams) {
    if (!this.shouldLog(params.level)) {
      return;
    }

    const logRecord = this.createLog(params);

    // 输出到控制台
    if (this.consoleEnabled) {
      const consoleLevel = params.level === "fatal" ? "error" : params.level;
      const consoleMessage = `[${logRecord.createTime}] [${logRecord.level.toUpperCase()}] ${logRecord.message}`;

      (console as any)[consoleLevel](consoleMessage, {
        ...logRecord,
        consoleMessage: undefined,
      });
    }

    // 存储日志
    this.storeLog(logRecord);
  }

  /**
   * 存储日志到 sessionStorage
   * @param logRecord 日志记录
   */
  private static storeLog(logRecord: LogRecord) {
    try {
      const logs = sessionStorage.get<LogRecord[]>(this.LOG_STORAGE_KEY) || [];

      // 添加新日志
      logs.push(logRecord);

      // 检查是否超出大小限制
      const totalSize = new Blob([JSON.stringify(logs)]).size;
      if (totalSize > this.MAX_LOG_SIZE) {
        // 删除最旧的日志直到满足限制
        while (logs.length > 0 && totalSize > this.MAX_LOG_SIZE) {
          logs.shift();
          // 重新计算大小
          const newSize = new Blob([JSON.stringify(logs)]).size;
          if (newSize <= this.MAX_LOG_SIZE) break;
        }
      }

      // 同时保留数量限制
      if (logs.length > this.MAX_LOGS) {
        logs.splice(0, logs.length - this.MAX_LOGS);
      }

      // 存储日志
      sessionStorage.set(this.LOG_STORAGE_KEY, logs);
    } catch (error: any) {
      // 存储失败时尝试清理存储空间
      if (error.name === 'QuotaExceededError') {
        this.clearLogs(); // 清空所有日志
        console.warn('日志存储已满，已自动清空');
        // 尝试重新存储当前日志
        try {
          sessionStorage.set(this.LOG_STORAGE_KEY, [logRecord]);
        } catch (retryError) {
          console.error('重试存储日志失败:', retryError);
        }
      } else {
        // 其他错误仅在控制台输出，不影响主流程
        console.error("Failed to store log:", error);
      }
    }
  }

  /**
   * 获取所有存储的日志
   * @returns 日志数组
   */
  static getLogs(): LogRecord[] {
    try {
      return sessionStorage.get<LogRecord[]>(this.LOG_STORAGE_KEY) || [];
    } catch (error) {
      this.log({ level: "error", message: "获取日志失败" + error });
      return [];
    }
  }

  /**
   * 根据条件筛选日志
   * @param filter 筛选条件
   * @returns 筛选后的日志数组
   */
  static filterLogs(filter: {
    level?: LogLevel;
    module?: string;
    operation?: string;
    startTime?: number;
    endTime?: number;
    userName?: string;
    userId?: string;
  }): LogRecord[] {
    const logs = this.getLogs();

    return logs.filter((log) => {
      if (filter.level && log.level !== filter.level) return false;
      if (filter.module && log.module !== filter.module) return false;
      if (filter.operation && log.operation !== filter.operation) return false;
      if (filter.startTime && log.timestamp < filter.startTime) return false;
      if (filter.endTime && log.timestamp > filter.endTime) return false;
      if (filter.userName && log.userName !== filter.userName) return false;
      if (filter.userId && log.userId !== filter.userId) return false;
      return true;
    });
  }

  /**
   * 清空所有存储的日志
   */
  static clearLogs() {
    try {
      sessionStorage.remove(this.LOG_STORAGE_KEY);
      this.log({ level: "warn", message: "清空所有存储的日志" });
    } catch (error) {
      this.log({ level: "error", message: "清空日志失败" + error });
    }
  }

  /**
   * 删除指定日志
   * @param timestamps 要删除的日志时间戳数组
   */
  static deleteLogs(timestamps: number[]) {
    try {
      const logs = this.getLogs();
      const filteredLogs = logs.filter(
        (log) => !timestamps.includes(log.timestamp)
      );
      const delLogs = logs.filter((log) => timestamps.includes(log.timestamp));
      sessionStorage.set(this.LOG_STORAGE_KEY, filteredLogs);
      this.log({ level: "warn", message: "删除指定日志", data: delLogs });
    } catch (error) {
      this.log({ level: "error", message: "删除日志失败" + error });
    }
  }

  /**
   * 导出日志为 JSON
   * @returns JSON 字符串
   */
  static exportLogsAsJSON(): string {
    const logs = this.getLogs();
    this.log({ level: "warn", message: "导出日志为 JSON", data: logs });
    return JSON.stringify(logs, null, 2);
  }

  /**
   * 导出日志为文本
   * @returns 文本字符串
   */
  static exportLogsAsText(): string {
    const logs = this.getLogs();
    this.log({ level: "warn", message: "导出日志为文本", data: logs });
    return logs
      .map((log) => {
        let text = `[${log.createTime}] [${log.level.toUpperCase()}]`;
        if (log.userName) text += ` [用户: ${log.userName}]`;
        if (log.userId) text += ` [用户ID: ${log.userId}]`;
        if (log.module) text += ` [模块: ${log.module}]`;
        if (log.operation) text += ` [操作: ${log.operation}]`;
        text += ` ${log.message}`;
        if (log.status) text += ` [状态: ${log.status}]`;
        if (log.data) text += `\n数据: ${JSON.stringify(log.data)}`;
        if (log.stack) text += `\n堆栈: ${log.stack}`;
        return text;
      })
      .join("\n\n");
  }

  /**
   * 下载日志文件
   * @param format 文件格式 (json | text)
   */
  static downloadLogs(format: "json" | "text" = "json") {
    const content =
      format === "json" ? this.exportLogsAsJSON() : this.exportLogsAsText();
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.LOG_STORAGE_KEY}-${new Date().toISOString()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    this.log({ level: "warn", message: "下载日志文件", data: url });
  }

  // ==================== 便捷方法 ====================

  /**
   * 记录 DEBUG 级别日志
   */
  static debug(message: string, data?: any) {
    this.log({ level: LOG_LEVEL.DEBUG, message, data });
  }

  /**
   * 记录 INFO 级别日志
   */
  static info(message: string, data?: any) {
    this.log({ level: LOG_LEVEL.INFO, message, data });
  }

  /**
   * 记录 WARN 级别日志
   */
  static warn(message: string, data?: any) {
    this.log({ level: LOG_LEVEL.WARN, message, data });
  }

  /**
   * 记录 ERROR 级别日志
   */
  static error(message: string, error?: Error, data?: any) {
    this.log({ level: LOG_LEVEL.ERROR, message, error, data });
  }

  /**
   * 记录 FATAL 级别日志
   */
  static fatal(message: string, error?: Error, data?: any) {
    this.log({ level: LOG_LEVEL.FATAL, message, error, data });
  }
}

/**
 * 类方法装饰器,用于自动记录方法调用日志
 * @param options 装饰器选项
 * @returns 装饰器函数
 * @example
 * class UserService {
 *   @LeeLoggerMethod({ level: LOG_LEVEL.INFO, module: "用户管理", operation: OPERATION_TYPE.CREATE })
 *   createUser(data: any) { }
 * }
 */
function LeeLoggerMethod(
  options: {
    level?: LogLevel;
    module?: string;
    operation?: OperationType | string;
  } = {}
) {
  const level = options.level || LOG_LEVEL.INFO;
  const module = options.module;
  const operation = options.operation;

  return function <This, Args extends any[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: This, ...args: Args): Return {
      // 记录方法调用前的日志
      LeeLogger.log({
        level,
        message: `调用方法: ${methodName}`,
        module,
        operation,
        data: { args },
        type: LOG_TYPE.METHOD,
      });

      try {
        const result = originalMethod.call(this, ...args);

        // 处理 Promise 返回值
        if (result instanceof Promise) {
          return result
            .then((res) => {
              // 检查是否为带有元数据的 API 请求
              const meta = (result as any)[REQUEST_LOG_META];

              LeeLogger.log({
                level,
                message: meta
                  ? `接口请求成功: ${meta.url}`
                  : `方法 ${methodName} 执行成功`,
                module,
                operation,
                status: OPERATION_STATUS.SUCCESS,
                data: {
                  apiUrl: meta ? meta.url : methodName,
                  apiParams: meta ? meta.data : args,
                  result: res,
                },
                type: meta ? LOG_TYPE.AJAX : LOG_TYPE.METHOD,
              });
              return res;
            })
            .catch((error) => {
              const meta = (result as any)[REQUEST_LOG_META];
              LeeLogger.log({
                level: LOG_LEVEL.ERROR,
                message: meta
                  ? `接口请求失败: ${meta.url}`
                  : `方法 ${methodName} 执行失败`,
                module,
                operation,
                status: OPERATION_STATUS.FAILURE,
                data: {
                  apiUrl: meta ? meta.url : methodName,
                  apiParams: meta ? meta.data : args,
                },
                error,
                type: meta ? LOG_TYPE.AJAX : LOG_TYPE.METHOD,
              });
              throw error;
            }) as Return;
        } else {
          // 同步方法执行成功
          LeeLogger.log({
            level,
            message: `方法 ${methodName} 执行成功`,
            module,
            operation,
            status: OPERATION_STATUS.SUCCESS,
            data: {
              apiUrl: methodName,
              apiParams: args,
              result,
            },
            type: LOG_TYPE.METHOD,
          });
        }

        return result;
      } catch (error) {
        // 同步方法执行失败
        LeeLogger.log({
          level: LOG_LEVEL.ERROR,
          message: `方法 ${methodName} 执行失败`,
          module,
          operation,
          status: OPERATION_STATUS.FAILURE,
          error: error as Error,
          type: LOG_TYPE.METHOD,
        });
        throw error;
      }
    }

    return replacementMethod;
  };
}

// ==================== 导出 ====================

export type {
  LogLevel,
  OperationType,
  OperationStatus,
  LogRecord,
  CreateLogParams,
  ComputerInfo,
  LoggerInitOptions,
};
export {
  LOG_LEVEL,
  LOG_TYPE,
  OPERATION_TYPE,
  OPERATION_STATUS,
  REQUEST_LOG_META,
  SSE_LOG_META,
  WEBSOCKET_LOG_META,
  LeeLogger,
  LeeLoggerMethod,
};
