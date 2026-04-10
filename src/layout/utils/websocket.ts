/** @format */

// 使用示例
/*
const ws = new SimpleWebSocket({
		url: 'wss://echo.websocket.org',
		reconnectInterval: 3000,
		maxReconnectAttempts: 5
});

ws.onMessage((data) => {
		console.log('收到消息:', data);
});

ws.onError((error) => {
		console.error('WebSocket错误:', error);
});

ws.onStateChange((state) => {
		console.log('状态变更:', WebSocketState[state]);
});

ws.connect();

// 发送消息
ws.send(JSON.stringify({ type: 'ping' }));

// 断开连接
ws.disconnect();
*/

/**
 * WebSocket 配置接口
 */
interface WebSocketConfig {
  /** WebSocket 服务器地址 */
  url: string;
  /** 重连间隔时间（毫秒），不设置则不自动重连 */
  reconnectInterval?: number;
  /** 最大重连尝试次数，不设置则无限重连 */
  maxReconnectAttempts?: number;
}

/**
 * 消息处理器类型
 * @param data - 接收到的数据（自动尝试 JSON 解析，失败则返回原始字符串）
 */
type MessageHandler = (data: any) => void;

/**
 * 错误处理器类型
 * @param error - WebSocket 错误事件
 */
type ErrorHandler = (error: Event) => void;

/**
 * 状态变更处理器类型
 * @param state - WebSocket 连接状态
 */
type StateHandler = (state: WebSocketState) => void;

/**
 * WebSocket 连接状态
 */
export const WebSocketState = {
  /** 连接中 */
  CONNECTING: 0,
  /** 已连接 */
  OPEN: 1,
  /** 关闭中 */
  CLOSING: 2,
  /** 已关闭 */
  CLOSED: 3,
} as const;

export type WebSocketState =
  (typeof WebSocketState)[keyof typeof WebSocketState];

/**
 * 简单 WebSocket 封装类
 * 提供基础的 WebSocket 连接、消息收发、错误处理和自动重连功能
 */
class SimpleWebSocket {
  /** WebSocket 实例 */
  private socket: WebSocket | null = null;
  /** 当前重连尝试次数 */
  private reconnectAttempts = 0;
  /** 重连定时器 */
  private reconnectTimer: any = null;

  /** 消息处理器 */
  private messageHandler: MessageHandler | null = null;
  /** 错误处理器 */
  private errorHandler: ErrorHandler | null = null;
  /** 状态变更处理器 */
  private stateHandler: StateHandler | null = null;

  private config: WebSocketConfig;

  /**
   * 构造函数
   * @param config - WebSocket 配置
   */
  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  /**
   * 连接到 WebSocket 服务器
   * 如果已经连接，则不会重复连接
   */
  connect(): void {
    // 检查是否已连接
    if (this.socket?.readyState === WebSocketState.OPEN) {
      return;
    }

    try {
      // 创建 WebSocket 实例
      this.socket = new WebSocket(
        import.meta.env.VITE_WS_BASE_URL + this.config.url
      );
      // 设置事件监听器
      this.setupEventListeners();
    } catch (error) {
      // 捕获创建 WebSocket 时的异常
      this.handleError(error as Event);
    }
  }

  /**
   * 断开 WebSocket 连接
   * 清理重连定时器并关闭连接
   */
  disconnect(): void {
    // 清理重连定时器
    this.clearReconnectTimer();

    // 关闭 WebSocket 连接
    if (this.socket) {
      // 移除事件监听，防止触发自动重连机制
      this.socket.onclose = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onopen = null;

      this.socket.close();
      this.socket = null;
    }

    // 手动通知状态变更（因为移除了 onclose 监听）
    if (this.stateHandler) {
      this.stateHandler(WebSocketState.CLOSED);
    }
  }

  /**
   * 发送消息
   * @param data - 要发送的数据，支持字符串、ArrayBuffer、Blob 等类型
   * @returns 发送是否成功（仅当连接为 OPEN 状态时才发送）
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (this.socket?.readyState === WebSocketState.OPEN) {
      this.socket.send(data);
      return true;
    }
    return false;
  }

  /**
   * 获取当前连接状态
   * @returns 当前 WebSocket 连接状态
   */
  getState(): WebSocketState {
    return (this.socket?.readyState ?? WebSocketState.CLOSED) as WebSocketState;
  }

  /**
   * 设置消息处理器
   * @param handler - 消息处理函数
   */
  onMessage(handler: MessageHandler): void {
    this.messageHandler = handler;
  }

  /**
   * 设置错误处理器
   * @param handler - 错误处理函数
   */
  onError(handler: ErrorHandler): void {
    this.errorHandler = handler;
  }

  /**
   * 设置状态变更处理器
   * @param handler - 状态变更处理函数
   */
  onStateChange(handler: StateHandler): void {
    this.stateHandler = handler;
  }

  /**
   * 设置 WebSocket 事件监听器
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // 连接建立事件
    this.socket.onopen = () => {
      // 连接成功后重置重连计数
      this.reconnectAttempts = 0;
      // 清理重连定时器
      this.clearReconnectTimer();
      // 通知状态变更
      this.notifyStateChange();
    };

    // 收到消息事件
    this.socket.onmessage = (event: MessageEvent) => {
      if (this.messageHandler) {
        try {
          // 尝试解析 JSON 数据
          const data = JSON.parse(event.data);
          this.messageHandler(data);
        } catch {
          // 解析失败则返回原始数据
          this.messageHandler(event.data);
        }
      }
    };

    // 错误事件
    this.socket.onerror = (event: Event) => {
      this.handleError(event);
      this.notifyStateChange();
    };

    // 连接关闭事件
    this.socket.onclose = () => {
      this.notifyStateChange();
      this.handleReconnect();
    };
  }

  /**
   * 处理错误事件
   * @param event - 错误事件
   */
  private handleError(event: Event): void {
    if (this.errorHandler) {
      this.errorHandler(event);
    }
  }

  /**
   * 通知状态变更
   */
  private notifyStateChange(): void {
    if (this.stateHandler && this.socket) {
      this.stateHandler(this.socket.readyState as WebSocketState);
    }
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect(): void {
    // 如果没有配置重连间隔，则不重连
    if (!this.config.reconnectInterval) return;

    // 获取最大重连次数（默认为无限）
    const maxAttempts = this.config.maxReconnectAttempts || Infinity;

    // 检查是否达到最大重连次数
    if (this.reconnectAttempts < maxAttempts) {
      // 清理之前的定时器
      this.clearReconnectTimer();

      // 设置新的重连定时器
      this.reconnectTimer = setTimeout(() => {
        // 增加重连计数
        this.reconnectAttempts++;
        // 重新连接
        this.connect();
      }, this.config.reconnectInterval);
    }
  }

  /**
   * 清理重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// 导出类型和类
export type { WebSocketConfig, MessageHandler, ErrorHandler, StateHandler };
export { SimpleWebSocket };
