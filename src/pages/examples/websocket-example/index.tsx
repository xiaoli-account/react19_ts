/** @format */

import { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Divider,
  Tag,
  Input,
  theme,
} from "antd";
import {
  LinkOutlined,
  DisconnectOutlined,
  SendOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { SimpleWebSocket, WebSocketState } from "@/layout/utils/websocket";

const { Paragraph, Text } = Typography;

const WebsocketExample = () => {
  const { token } = theme.useToken();
  const [messages, setMessages] = useState<
    Array<{ type: "sent" | "received" | "system"; data: string; time: string }>
  >([]);
  const [inputMsg, setInputMsg] = useState('{"type":"ping"}');
  const [connState, setConnState] = useState<number>(WebSocketState.CLOSED);
  const wsRef = useRef<SimpleWebSocket | null>(null);

  // 清理连接
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  const handleConnect = () => {
    if (wsRef.current && wsRef.current.getState() === WebSocketState.OPEN)
      return;

    // 使用公共 echo 测试服务
    const ws = new SimpleWebSocket({
      url: "/ws",
      reconnectInterval: 3000,
      maxReconnectAttempts: 3,
    });

    wsRef.current = ws;

    ws.onStateChange((state) => {
      setConnState(state);
      const stateName = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][state];
      addLog("system", `连接状态变更为: ${stateName}`);
    });

    ws.onMessage((data) => {
      const displayData =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      addLog("received", displayData);
    });

    ws.onError((e) => {
      addLog("system", "WebSocket 发生错误");
    });

    ws.connect();
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
  };

  const handleSend = () => {
    if (!wsRef.current || connState !== WebSocketState.OPEN) return;
    if (!inputMsg) return;

    const success = wsRef.current.send(inputMsg);
    if (success) {
      addLog("sent", inputMsg);
    } else {
      addLog("system", "发送失败");
    }
  };

  const addLog = (type: "sent" | "received" | "system", data: string) => {
    setMessages((prev) => [
      {
        type,
        data,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="websocket-example-container">
      <Card title="WebSocket 双向通信示例" variant="borderless">
        <Paragraph>
          演示基于 <Text code>SimpleWebSocket</Text>{" "}
          封装类的长连接通信。使用公网 echo 服务进行测试
          (wss://echo.websocket.org)。
        </Paragraph>

        <Card
          type="inner"
          title="开发环境代理配置 (Vite Proxy)"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Paragraph style={{ marginBottom: 0 }}>
            <Text strong>WS 前缀:</Text> <Text code>/dev-ws</Text>
            <br />
            <Text strong>目标地址:</Text>{" "}
            <Text code>wss://echo.websocket.org</Text> (VITE_APP_WS_ENDPOINT)
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              说明: 请求 <Text code>/dev-ws/...</Text> 会被代理到{" "}
              <Text code>wss://echo.websocket.org/...</Text>
            </Text>
          </Paragraph>
        </Card>

        <Divider titlePlacement="left">连接控制</Divider>
        <Space wrap size="middle" style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<LinkOutlined />}
            onClick={handleConnect}
            disabled={
              connState === WebSocketState.OPEN ||
              connState === WebSocketState.CONNECTING
            }
          >
            建立连接
          </Button>

          <Button
            danger
            icon={<DisconnectOutlined />}
            onClick={handleDisconnect}
            disabled={connState === WebSocketState.CLOSED}
          >
            断开连接
          </Button>

          <Tag
            color={
              connState === WebSocketState.OPEN
                ? "success"
                : connState === WebSocketState.CONNECTING
                  ? "processing"
                  : "default"
            }
          >
            状态: {["连接中", "已连接", "关闭中", "已关闭"][connState]}
          </Tag>
        </Space>

        <Divider titlePlacement="left">消息发送</Divider>
        <Space.Compact
          style={{ width: "100%", maxWidth: 600, marginBottom: 24 }}
        >
          <Input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="输入要发送的消息..."
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={connState !== WebSocketState.OPEN}
          >
            发送消息
          </Button>
        </Space.Compact>

        <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
          {/* 代码展示区 */}
          <Card
            type="inner"
            title="调用代码"
            size="small"
            style={{ backgroundColor: token.colorFillAlter }}
          >
            <pre style={{ margin: 0, fontSize: 13 }}>
              {`import { SimpleWebSocket } from "@/layout/utils/websocket";

// 1. 初始化
const ws = new SimpleWebSocket({
  url: 'wss://echo.websocket.org',
  reconnectInterval: 3000
});

// 2. 监听消息
ws.onMessage((data) => {
  console.log('收到:', data);
});

// 3. 建立连接
ws.connect();

// 4. 发送数据
ws.send(JSON.stringify({ type: 'hello' }));`}
            </pre>
          </Card>

          {/* 交互日志区 */}
          <Card
            type="inner"
            title="通信日志 (Communication Logs)"
            extra={
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={() => setMessages([])}
              >
                清空
              </Button>
            }
            size="small"
            style={{ minHeight: 400 }}
          >
            <div style={{ maxHeight: 500, overflow: "auto" }}>
              <div>
                {messages.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 0",
                      display: "flex",
                      justifyContent:
                        item.type === "sent"
                          ? "flex-end"
                          : item.type === "received"
                            ? "flex-start"
                            : "center",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        backgroundColor:
                          item.type === "sent"
                            ? token.colorPrimaryBg
                            : item.type === "received"
                              ? token.colorSuccessBg
                              : token.colorFillQuaternary,
                        border:
                          item.type === "sent"
                            ? `1px solid ${token.colorPrimaryBorder}`
                            : item.type === "received"
                              ? `1px solid ${token.colorSuccessBorder}`
                              : `1px solid ${token.colorBorder}`,
                        padding: "8px 12px",
                        borderRadius: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                          item.type === "sent"
                            ? "flex-end"
                            : item.type === "received"
                              ? "flex-start"
                              : "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: token.colorTextSecondary,
                          marginBottom: 4,
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <span>{item.time}</span>
                        <span style={{ fontWeight: "bold" }}>
                          {item.type === "sent"
                            ? "发送 (Client)"
                            : item.type === "received"
                              ? "接收 (Server)"
                              : "系统消息"}
                        </span>
                      </div>
                      <Text
                        style={{
                          wordBreak: "break-all",
                          color:
                            item.type === "system"
                              ? token.colorTextTertiary
                              : undefined,
                        }}
                      >
                        {item.data}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: token.colorTextDescription,
                  }}
                >
                  暂无通信记录，请建立连接并发送消息
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default WebsocketExample;
