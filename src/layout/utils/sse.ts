/** @format */

/**
 * SSE 错误类
 * 扩展自 JavaScript 内置的 Error 类，用于处理 SSE 连接中的各种错误情况
 */
class SSEError extends Error {
  /**
   * 错误代码，用于标识错误类型
   */
  public code: string;

  /**
   * 错误原因，可选的底层错误对象
   */
  public cause?: Error;

  /**
   * 构造函数
   * @param message - 错误消息
   * @param code - 错误代码，默认为 "SSE_ERROR"
   * @param cause - 可选的底层错误原因
   */
  constructor(message: string, code: string = "SSE_ERROR", cause?: Error) {
    super(message);
    this.name = "SSEError";
    this.code = code;
    this.cause = cause;

    // 保持原型链，确保 instanceof 操作符正常工作
    Object.setPrototypeOf(this, SSEError.prototype);

    // 在开发环境下提供更好的堆栈跟踪
    // 使用类型断言来访问 Node.js 特有的 captureStackTrace 方法
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, SSEError);
    }
  }

  /**
   * 将错误对象转换为字符串表示
   * @returns 格式化的错误字符串
   */
  toString(): string {
    return `SSEError [${this.code}]: ${this.message}`;
  }
}

/**
 * SSE 事件基础接口
 * 定义所有 SSE 事件共有的属性
 */
interface SSEEventBase {
  /**
   * 事件类型
   */
  type: string;

  /**
   * 事件时间戳
   */
  timestamp: string;
}

/**
 * SSE 连接打开事件接口
 * 当 SSE 连接成功建立时触发
 */
interface SSEOpenEvent extends SSEEventBase {
  /**
   * 事件类型，固定为 "open"
   */
  type: "open";

  /**
   * 连接的 URL
   */
  url: string;
}

/**
 * SSE 消息事件接口
 * 当接收到服务器发送的消息时触发
 */
interface SSEMessageEvent extends SSEEventBase {
  /**
   * 事件类型，可以是 "message" 或自定义事件类型
   */
  type: "message" | string;

  /**
   * 消息数据内容
   */
  data: string;

  /**
   * 可选的消息 ID
   */
  id?: string;

  /**
   * 可选的重连时间（毫秒）
   */
  retry?: number;
}

/**
 * SSE 错误事件接口
 * 当 SSE 连接发生错误时触发
 */
interface SSEErrorEvent extends SSEEventBase {
  /**
   * 事件类型，固定为 "error"
   */
  type: "error";

  /**
   * 错误对象，可以是标准 Error 或 SSEError
   */
  error: Error | SSEError;
}

/**
 * SSE 连接关闭事件接口
 * 当 SSE 连接关闭时触发
 */
interface SSECloseEvent extends SSEEventBase {
  /**
   * 事件类型，固定为 "close"
   */
  type: "close";

  /**
   * 重连尝试次数
   */
  reconnectAttempts: number;
}

/**
 * 联合类型，表示所有可能的 SSE 事件
 */
type SSEEvent = SSEOpenEvent | SSEMessageEvent | SSEErrorEvent | SSECloseEvent;

/**
 * SSE 客户端配置选项接口
 * 定义创建 SSE 连接时可以配置的选项
 */
interface SSEClientOptions {
  /**
   * HTTP 请求方法，默认为 "GET"
   */
  method?: "GET" | "POST";

  /**
   * 是否携带凭证（cookies），默认为 false
   */
  withCredentials?: boolean;

  /**
   * HTTP 请求头
   */
  headers?: Record<string, string>;

  /**
   * 请求体数据
   */
  body?: any;

  /**
   * 最大重连尝试次数，默认为 3
   */
  maxReconnectAttempts?: number;

  /**
   * 重连间隔时间（毫秒），默认为 3000
   */
  reconnectInterval?: number;

  /**
   * AbortSignal 对象，用于取消请求
   */
  signal?: AbortSignal;

  /**
   * 查询参数对象
   */
  queryParams?: Record<string, string | number | boolean>;

  /**
   * 认证令牌
   */
  token?: string;
}

/**
 * SSE 事件监听器回调函数接口
 * 定义各种事件类型的处理函数
 */
interface SSEEventListeners {
  /**
   * 连接打开事件处理函数
   */
  onOpen?: (event: SSEOpenEvent) => void;

  /**
   * 消息事件处理函数
   */
  onMessage?: (event: SSEMessageEvent) => void;

  /**
   * 错误事件处理函数
   */
  onError?: (event: SSEErrorEvent) => void;

  /**
   * 连接关闭事件处理函数
   */
  onClose?: (event: SSECloseEvent) => void;
}

/**
 * 解析后的消息事件内部表示接口
 * 用于在内部处理消息事件数据
 */
interface ParsedEvent {
  /**
   * 事件类型
   */
  type: string;

  /**
   * 消息数据
   */
  data: string;

  /**
   * 可选的事件 ID
   */
  id?: string;

  /**
   * 可选的重连时间
   */
  retry?: number;
}

/**
 * SSE 客户端类
 * 提供 Server-Sent Events 连接的完整实现
 */
class SSEClient {
  /**
   * 连接的 URL
   */
  private url: string;

  /**
   * 配置选项
   */
  private options: Required<SSEClientOptions>;

  /**
   * AbortController 对象，用于控制连接的中止
   */
  private controller: AbortController;

  /**
   * 连接状态标识
   */
  private isConnected: boolean;

  /**
   * 连接打开事件处理函数
   */
  private onOpen: ((event: SSEOpenEvent) => void) | null;

  /**
   * 消息事件处理函数
   */
  private onMessage: ((event: SSEMessageEvent) => void) | null;

  /**
   * 错误事件处理函数
   */
  private onError: ((event: SSEErrorEvent) => void) | null;

  /**
   * 连接关闭事件处理函数
   */
  private onClose: ((event: SSECloseEvent) => void) | null;

  /**
   * 重连尝试次数
   */
  private reconnectAttempts: number;

  /**
   * 最大重连尝试次数
   */
  private maxReconnectAttempts: number;

  /**
   * 重连间隔时间（毫秒）
   */
  private reconnectInterval: number;

  /**
   * 构造函数
   * @param url - 要连接的服务器 URL
   * @param options - 可选的配置选项
   */
  constructor(url: string, options: SSEClientOptions = {}) {
    this.url = this.buildUrl(url, options);
    this.options = {
      method: "GET",
      withCredentials: false,
      headers: {},
      body: null,
      maxReconnectAttempts: 3,
      reconnectInterval: 3000,
      queryParams: {},
      token: "",
      ...options,
    } as Required<SSEClientOptions>;
    this.controller = new AbortController();
    this.isConnected = false;

    // 初始化事件回调函数
    this.onOpen = null;
    this.onMessage = null;
    this.onError = null;
    this.onClose = null;

    // 初始化重连相关属性
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = this.options.maxReconnectAttempts || 3;
    this.reconnectInterval = this.options.reconnectInterval || 3000;
  }

  /**
   * 构建完整 URL
   * 处理查询参数和 token 等 URL 构建逻辑
   * @param url - 基础 URL
   * @param options - 配置选项
   * @returns 完整的 URL 字符串
   * @throws SSEError 当 URL 格式无效时抛出错误
   */
  private buildUrl(url: string, options: SSEClientOptions): string {
    if (!url) {
      throw new SSEError("URL is required", "INVALID_URL");
    }

    try {
      const urlObj = new URL(
        url,
        url.startsWith("http") ? undefined : window.location.origin
      );

      // 处理查询参数
      if (options.queryParams) {
        Object.entries(options.queryParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            urlObj.searchParams.append(key, String(value));
          }
        });
      }

      // 处理 token（如果提供了 token 但没有在 headers 中设置 Authorization）
      if (options.token && !options.headers?.Authorization) {
        urlObj.searchParams.append("token", options.token);
      }

      return urlObj.toString();
    } catch (error) {
      throw new SSEError(
        `Invalid URL format: ${url}`,
        "INVALID_URL_FORMAT",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * 建立 SSE 连接
   * 使用 fetch API 建立连接并处理服务器发送的事件
   * @throws SSEError 当连接失败时抛出错误
   */
  async connect() {
    try {
      console.log("开始建立SSE连接", this.url, this.options);

      const headers = {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        ...this.options.headers,
      };

      // 准备请求体
      let body: BodyInit | null = null;
      if (this.options.body) {
        if (this.options.body instanceof FormData) {
          body = this.options.body;
          // 移除 Content-Type 让浏览器自动设置
          delete this.options.headers["Content-Type"];
        } else if (typeof this.options.body === "object") {
          body = JSON.stringify(this.options.body);
          this.options.headers["Content-Type"] = "application/json";
        } else {
          body = this.options.body;
        }
      }

      const response = await fetch(this.url, {
        method: this.options.method,
        headers: headers,
        body: body,
        credentials: this.options.withCredentials ? "include" : "same-origin",
        signal: this.controller.signal,
      });

      console.log("SSE连接响应接收", this.url, this.options);

      if (!response.ok) {
        throw new SSEError(
          `HTTP error! status: ${response.status}`,
          "HTTP_ERROR",
          new Error(
            `Server returned ${response.status}: ${response.statusText}`
          )
        );
      }

      if (!response.body) {
        throw new SSEError(
          "ReadableStream not supported in this browser",
          "STREAM_NOT_SUPPORTED"
        );
      }

      this.isConnected = true;
      this.reconnectAttempts = 0;

      // 触发连接成功事件
      if (this.onOpen) {
        this.onOpen({
          type: "open",
          url: this.url,
          timestamp: new Date().toISOString(),
        });
      }

      // 使用 Streams API 处理数据流
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (this.isConnected) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("SSE连接已关闭");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // 保留最后一行（可能不完整）
        buffer = lines.pop() || "";

        let event: {
          id: string;
          type: string;
          data: string;
          retry?: number;
        } = { id: "", type: "message", data: "", retry: undefined };

        for (const line of lines) {
          if (line.startsWith("event:")) {
            event.type = line.replace("event:", "").trim();
          } else if (line.startsWith("data:")) {
            event.data += line.replace("data:", "").trim() + "\n";
          } else if (line.startsWith("id:")) {
            event.id = line.replace("id:", "").trim();
          } else if (line.startsWith("retry:")) {
            event.retry = parseInt(line.replace("retry:", "").trim());
          }

          // 空行表示一个完整的消息结束
          if (line.trim() === "") {
            if (event.data) {
              // 去除最后一个换行符
              event.data = event.data.trim();

              // 触发消息事件
              if (this.onMessage) {
                this.onMessage({
                  ...event,
                  timestamp: new Date().toISOString(),
                });
              }
            }

            // 重置事件对象
            event = { id: "", type: "message", data: "", retry: undefined };
          }
        }
      }

      this.handleClose();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("SSE连接被主动中止");
        this.handleClose();
      } else {
        console.error("SSE连接错误:", error);
        this.handleError(
          error instanceof Error ? error : new SSEError(String(error))
        );
      }
    }
  }

  /**
   * 处理错误
   * 统一处理各种类型的错误并触发错误事件
   * @param error - 错误对象
   */
  private handleError(error: Error | SSEError) {
    // 确保错误是 SSEError 类型
    const sseError =
      error instanceof SSEError
        ? error
        : new SSEError(error.message, "CONNECTION_ERROR", error);

    if (this.onError) {
      this.onError({
        type: "error",
        error: sseError,
        timestamp: new Date().toISOString(),
      });
    }

    // 自动重连逻辑（只对非中止错误和可重试错误进行重连）
    if (this.shouldRetry(sseError)) {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );

        setTimeout(() => {
          if (!this.isConnected) {
            this.connect().catch((err) => {
              console.error("重连失败:", err);
            });
          }
        }, this.reconnectInterval);
      } else {
        console.error("达到最大重连次数，停止重连");
        this.handleClose();
      }
    } else {
      this.handleClose();
    }
  }

  /**
   * 判断错误是否应该重试
   * 根据错误代码决定是否应该尝试重新连接
   * @param error - SSE 错误对象
   * @returns 如果应该重试返回 true，否则返回 false
   */
  private shouldRetry(error: SSEError): boolean {
    // 不重试的错误类型
    const nonRetryableErrors = [
      "INVALID_URL",
      "INVALID_URL_FORMAT",
      "ABORT_ERROR",
    ];

    return !nonRetryableErrors.includes(error.code);
  }

  /**
   * 处理连接关闭
   * 统一处理连接关闭逻辑并触发关闭事件
   */
  private handleClose() {
    this.isConnected = false;
    if (this.onClose) {
      this.onClose({
        type: "close",
        timestamp: new Date().toISOString(),
        reconnectAttempts: this.reconnectAttempts,
      });
    }
  }

  /**
   * 关闭连接
   * 主动关闭 SSE 连接并中止所有相关请求
   */
  close() {
    console.log("主动关闭SSE连接");
    this.isConnected = false;
    this.controller.abort();
  }

  /**
   * 设置事件监听器
   * 允许用户设置各种事件的处理函数
   * @param listeners - 事件监听器对象
   */
  setEventListeners(listeners: SSEEventListeners) {
    if (listeners.onOpen) this.onOpen = listeners.onOpen;
    if (listeners.onMessage) this.onMessage = listeners.onMessage;
    if (listeners.onError) this.onError = listeners.onError;
    if (listeners.onClose) this.onClose = listeners.onClose;
  }

  /**
   * 获取当前连接状态
   * @returns 如果已连接返回 true，否则返回 false
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * 获取重连尝试次数
   * @returns 当前已尝试的重连次数
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * 获取构建后的完整 URL
   * @returns 完整的连接 URL
   */
  getUrl(): string {
    return this.url;
  }
}

// 导出错误类和相关类型
export { SSEError };
export type {
  SSEEvent,
  SSEOpenEvent,
  SSEMessageEvent,
  SSEErrorEvent,
  SSECloseEvent,
  SSEClientOptions,
  SSEEventListeners,
  ParsedEvent,
};

export default SSEClient;
