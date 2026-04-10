/** @format */

// ===========================================================================
// React 18 SSE Hook
// 基于 SSE(v4.0).ts 的 React Hook 封装，提供响应式 SSE 连接管理
// ===========================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SSEClient, {
  type SSEOpenEvent,
  type SSEMessageEvent,
  type SSEErrorEvent,
  type SSECloseEvent,
  type SSEClientOptions,
  type SSEEventListeners,
  SSEError,
} from "@/layout/utils/sse";

/**
 * React SSE Hook 配置选项
 * 基于 SSEClientOptions，添加了 React 特定的配置
 */
interface UseSSEOptions extends SSEClientOptions {
  /** 是否自动连接 */
  autoConnect?: boolean;
  /** 最大事件历史记录数 */
  maxEvents?: number;
  /** 消息格式化函数 */
  formatMessage?: (data: string) => any;
  /** 自定义事件监听器 */
  eventListeners?: Partial<ReactSSEEventListeners>;
}

/**
 * React SSE 事件监听器接口（扩展了基础接口）
 */
interface ReactSSEEventListeners extends SSEEventListeners {
  onMessage?: (data: any, event?: SSEMessageEvent) => void;
}

/**
 * SSE 状态接口
 */
interface SSEState {
  /** 连接状态 */
  isConnected: boolean;
  /** 是否正在连接 */
  isConnecting: boolean;
  /** 最后收到的消息 */
  lastMessage: SSEMessageEvent | null;
  /** 错误信息 */
  lastError: SSEError | null;
  /** 重连尝试次数 */
  reconnectAttempts: number;
  /** 连接状态描述 */
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "error"
    | "reconnecting";
}

/**
 * 事件历史记录项接口
 */
interface EventHistoryItem {
  type: string;
  data: any;
  timestamp: Date;
  originalEvent?: SSEMessageEvent;
}

/**
 * 自定义事件处理器接口
 */
interface CustomEventHandler {
  (data: any, originalEvent?: SSEMessageEvent): void;
}

/**
 * React SSE Hook 返回值接口
 */
interface UseSSEReturn {
  // 状态
  state: SSEState;
  // 消息列表
  messages: SSEMessageEvent[];
  // 事件历史记录
  eventHistory: EventHistoryItem[];
  // 连接方法
  connect: () => Promise<void>;
  // 断开连接方法
  disconnect: () => void;
  // 重连方法
  reconnect: () => Promise<void>;
  // 添加自定义事件监听器
  addEventListener: (eventType: string, handler: CustomEventHandler) => void;
  // 移除自定义事件监听器
  removeEventListener: (eventType: string) => void;
  // 清空消息历史
  clearMessages: () => void;
  // 获取连接 URL
  getConnectionUrl: () => string | null;
}

/**
 * React SSE Hook
 * 基于 SSE(v4.0).ts 的 SSEClient 类，提供响应式的 SSE 连接管理
 *
 * @param url - SSE 服务器端点 URL
 * @param options - SSE 连接配置选项
 * @returns 包含状态和控制方法的对象
 *
 * @example
 * ```tsx
 * // 在组件中使用
 * const {
 *   state,
 *   messages,
 *   connect,
 *   disconnect
 * } = useSSE('/api/events', {
 *   autoConnect: true,
 *   maxEvents: 50,
 *   formatMessage: (data) => JSON.parse(data),
 *   eventListeners: {
 *     onOpen: (event) => console.log('连接建立:', event),
 *     onMessage: (data, event) => console.log('收到消息:', data),
 *     onError: (event) => console.error('连接错误:', event.error),
 *     onClose: (event) => console.log('连接关闭:', event)
 *   }
 * });
 *
 * // 监听自定义事件
 * addEventListener('stream-data', (data, originalEvent) => {
 *   console.log('接收到自定义事件:', data);
 * });
 * ```
 */
export const useSSE = (
  url: string,
  options: UseSSEOptions = {}
): UseSSEReturn => {
  // 状态管理
  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    lastMessage: null,
    lastError: null,
    reconnectAttempts: 0,
    connectionStatus: "disconnected",
  });

  const [messages, setMessages] = useState<SSEMessageEvent[]>([]);
  const [eventHistory, setEventHistory] = useState<EventHistoryItem[]>([]);

  // 引用管理
  const sseClientRef = useRef<SSEClient | null>(null);
  const customEventHandlersRef = useRef<Map<string, CustomEventHandler>>(
    new Map()
  );

  // 配置合并
  const config = useMemo(
    () => ({
      method: "POST" as const,
      withCredentials: false,
      headers: {},
      body: null,
      queryParams: {},
      maxReconnectAttempts: 3,
      reconnectInterval: 3000,
      autoConnect: true,
      maxEvents: 100,
      ...options,
    }),
    [options]
  );

  /**
   * 添加事件到历史记录
   */
  const addToEventHistory = useCallback(
    (type: string, data: any, originalEvent?: SSEMessageEvent) => {
      setEventHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            type,
            data,
            timestamp: new Date(),
            originalEvent,
          },
        ];

        // 限制事件历史记录数量，避免内存泄漏
        if (newHistory.length > (config.maxEvents || 100)) {
          return newHistory.slice(1);
        }
        return newHistory;
      });
    },
    [config.maxEvents]
  );

  /**
   * 内置 SSE 事件监听器
   */
  const baseEventListeners = useMemo<SSEEventListeners>(
    () => ({
      onOpen: (event: SSEOpenEvent) => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          connectionStatus: "connected",
          lastError: null,
          reconnectAttempts: 0,
        }));

        addToEventHistory("open", { url: event.url });
        config.eventListeners?.onOpen?.(event);
      },

      onMessage: (event: SSEMessageEvent) => {
        setState((prev) => ({ ...prev, lastMessage: event }));
        setMessages((prev) => [...prev, event]);

        let parsedData = event.data;

        // 如果有格式化函数，尝试格式化消息数据
        if (config.formatMessage && event.data) {
          try {
            parsedData = config.formatMessage(event.data);
          } catch (e) {
            console.warn("消息格式化失败:", e);
          }
        }

        addToEventHistory(event.type, parsedData, event);

        // 检查是否有自定义事件处理器
        if (event.type !== "message") {
          const handler = customEventHandlersRef.current.get(event.type);
          if (handler) {
            handler(parsedData, event);
          }
        }

        // 调用用户自定义的 onMessage 处理器
        config.eventListeners?.onMessage?.(parsedData, event);
      },

      onError: (event: SSEErrorEvent) => {
        const error =
          event.error instanceof SSEError
            ? event.error
            : new SSEError(event.error.message);

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          connectionStatus: "error",
          lastError: error,
          reconnectAttempts: sseClientRef.current?.getReconnectAttempts() || 0,
        }));

        console.error("SSE 连接错误:", event);
        addToEventHistory("error", {
          error: event.error.message,
          code:
            event.error instanceof SSEError
              ? event.error.code
              : "UNKNOWN_ERROR",
        });

        config.eventListeners?.onError?.(event);
      },

      onClose: (event: SSECloseEvent) => {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          reconnectAttempts: event.reconnectAttempts,
          connectionStatus: "disconnected",
        }));

        addToEventHistory("close", {
          reconnectAttempts: event.reconnectAttempts,
        });
        config.eventListeners?.onClose?.(event);
      },
    }),
    [addToEventHistory, config.eventListeners, config.formatMessage]
  );

  /**
   * 建立 SSE 连接
   */
  const connect = useCallback(async (): Promise<void> => {
    if (sseClientRef.current) {
      console.warn("SSE 连接已存在或正在连接中");
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        isConnecting: true,
        connectionStatus: "connecting",
        lastError: null,
      }));

      // 创建 SSE 客户端实例
      sseClientRef.current = new SSEClient(
        import.meta.env.VITE_SSE_BASE_URL + url,
        {
          method: config.method,
          withCredentials: config.withCredentials,
          headers: config.headers,
          body: config.body ? JSON.parse(JSON.stringify(config.body)) : null,
          maxReconnectAttempts: config.maxReconnectAttempts,
          reconnectInterval: config.reconnectInterval,
          queryParams: config.queryParams,
        }
      );

      // 设置事件监听器
      sseClientRef.current.setEventListeners(baseEventListeners);

      // 开始连接
      await sseClientRef.current.connect();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        connectionStatus: "error",
        lastError:
          err instanceof SSEError
            ? err
            : new SSEError(
                err instanceof Error ? err.message : String(err),
                "CONNECTION_FAILED"
              ),
      }));
      console.error("SSE 连接失败:", err);
      throw err;
    }
  }, [url, config, baseEventListeners]);

  /**
   * 断开 SSE 连接
   */
  const disconnect = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isConnecting: false,
      connectionStatus: "disconnected",
    }));

    if (sseClientRef.current) {
      sseClientRef.current.close();
      sseClientRef.current = null;
    }
  }, []);

  /**
   * 重新连接
   */
  const reconnect = useCallback(async (): Promise<void> => {
    disconnect();
    // 添加短暂延迟确保连接完全断开
    await new Promise((resolve) => setTimeout(resolve, 100));
    await connect();
  }, [connect, disconnect]);

  /**
   * 添加自定义事件监听器
   */
  const addEventListener = useCallback(
    (eventType: string, handler: CustomEventHandler): void => {
      customEventHandlersRef.current.set(eventType, handler);
    },
    []
  );

  /**
   * 移除自定义事件监听器
   */
  const removeEventListener = useCallback((eventType: string): void => {
    customEventHandlersRef.current.delete(eventType);
  }, []);

  /**
   * 清空消息历史
   */
  const clearMessages = useCallback((): void => {
    setMessages([]);
    setEventHistory([]);
    setState((prev) => ({ ...prev, lastMessage: null }));
  }, []);

  /**
   * 获取连接 URL
   */
  const getConnectionUrl = useCallback((): string | null => {
    return sseClientRef.current?.getUrl() || null;
  }, []);

  // 自动连接
  useEffect(() => {
    if (config.autoConnect) {
      connect().catch((err) => {
        console.error("SSE 自动连接失败:", err);
      });
    }

    // 清理函数
    return () => {
      if (sseClientRef.current) {
        disconnect();
      }
    };
  }, [connect, disconnect, config.autoConnect]);

  return {
    state,
    messages,
    eventHistory,
    connect,
    disconnect,
    reconnect,
    addEventListener,
    removeEventListener,
    clearMessages,
    getConnectionUrl,
  };
};

/**
 * 预定义的消息格式化函数
 */
export const messageFormatters = {
  /**
   * JSON 格式化器
   */
  json: (data: string) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn("JSON 解析失败:", e);
      return data;
    }
  },

  /**
   * 文本格式化器（原样返回）
   */
  text: (data: string) => data,

  /**
   * 数字格式化器
   */
  number: (data: string) => {
    const num = Number(data);
    return isNaN(num) ? data : num;
  },
};

/**
 * 预定义的事件监听器创建函数
 */
export const eventListenerCreators = {
  /**
   * 创建控制台日志监听器
   */
  createConsoleLogger: (): SSEEventListeners => ({
    onOpen: (event) => console.log("[SSE] 连接已建立:", event.url),
    onMessage: (event) => console.log("[SSE] 收到消息:", event),
    onError: (event) => console.error("[SSE] 连接错误:", event.error),
    onClose: (event) =>
      console.log("[SSE] 连接已关闭, 重连次数:", event.reconnectAttempts),
  }),

  /**
   * 创建状态更新监听器
   */
  createStatusUpdater: (
    updateCallback: (status: string) => void
  ): SSEEventListeners => ({
    onOpen: () => updateCallback("connected"),
    onError: () => updateCallback("error"),
    onClose: () => updateCallback("disconnected"),
  }),

  /**
   * 创建错误通知监听器
   */
  createErrorNotifier: (
    notifyCallback: (error: SSEError) => void
  ): SSEEventListeners => ({
    onError: (event) => {
      const error =
        event.error instanceof SSEError
          ? event.error
          : new SSEError(event.error.message, "NOTIFICATION_ERROR");
      notifyCallback(error);
    },
  }),
};

/**
 * 创建 SSE 连接的快捷函数
 */
export const createSSEConnection = (url: string, options?: UseSSEOptions) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSSE(url, options);
};

// 导出类型
export type {
  UseSSEOptions,
  UseSSEReturn,
  SSEState,
  EventHistoryItem,
  CustomEventHandler,
  ReactSSEEventListeners,
};
