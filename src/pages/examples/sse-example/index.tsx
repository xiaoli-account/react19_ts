/** @format */

import { Card, Button, Space, Typography, Divider, Tag, theme } from "antd";
import {
  PlayCircleOutlined,
  StopOutlined,
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useSSE } from "@/hooks/use-sse";

const { Paragraph, Text } = Typography;

const SseExample = () => {
  const { token } = theme.useToken();
  const sseOptions = useMemo(
    () => ({
      method: "GET" as const,
      autoConnect: false,
      maxEvents: 20,
      formatMessage: (data: string) => {
        try {
          const d = JSON.parse(data);
          return {
            user: d.user,
            title: d.title,
            wiki: d.wiki,
          };
        } catch (e) {
          return data;
        }
      },
      eventListeners: {
        onOpen: (event: any) => console.log("连接建立:", event),
        onMessage: (data: any, event: any) => console.log("收到消息:", data),
        onError: (event: any) => console.error("连接错误:", event.error),
        onClose: (event: any) => console.log("连接关闭:", event),
      },
    }),
    []
  );

  const { state, eventHistory, connect, disconnect, reconnect, clearMessages } =
    useSSE("/v2/stream/recentchange", sseOptions);

  return (
    <div className="sse-example-container">
      <Card
        title="SSE (Server-Sent Events) 实时流示例 (React Hook)"
        variant="borderless"
      >
        <Paragraph>
          演示使用封装的 <Text code>useSSE</Text> Hook
          实现流式数据接收。相比直接使用 Client 类，Hook 更加符合 React
          开发体验。
        </Paragraph>

        <Card
          type="inner"
          title="开发环境代理配置 (Vite Proxy)"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Paragraph style={{ marginBottom: 0 }}>
            <Text strong>SSE 前缀:</Text> <Text code>/dev-sse</Text>
            <br />
            <Text strong>目标地址:</Text>{" "}
            <Text code>https://stream.wikimedia.org</Text>{" "}
            (VITE_APP_SSE_ENDPOINT)
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              说明: 请求 <Text code>/dev-sse/...</Text> 会被代理到{" "}
              <Text code>https://stream.wikimedia.org/...</Text>
            </Text>
          </Paragraph>
        </Card>

        <Divider titlePlacement="left">操作控制</Divider>
        <Space wrap size="middle" style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => connect()}
            disabled={
              state.connectionStatus === "connected" ||
              state.connectionStatus === "connecting"
            }
            loading={state.connectionStatus === "connecting"}
          >
            开始连接 (Connect)
          </Button>

          <Button
            danger
            icon={<StopOutlined />}
            onClick={() => disconnect()}
            disabled={state.connectionStatus === "disconnected"}
          >
            断开连接 (Disconnect)
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => reconnect()}
            disabled={state.connectionStatus === "disconnected"}
          >
            重新连接 (Reconnect)
          </Button>

          <Button icon={<ClearOutlined />} onClick={clearMessages}>
            清空日志
          </Button>

          <Tag
            color={
              state.connectionStatus === "connected"
                ? "success"
                : state.connectionStatus === "connecting"
                  ? "processing"
                  : state.connectionStatus === "error"
                    ? "error"
                    : "default"
            }
          >
            当前状态: {state.connectionStatus.toUpperCase()}
          </Tag>
        </Space>

        <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
          {/* 代码展示区 */}
          <Card
            type="inner"
            title="Hook 调用代码"
            size="small"
            style={{ backgroundColor: token.colorFillAlter }}
          >
            <pre style={{ margin: 0, fontSize: 13 }}>
              {`import { useSSE } from "@/utils/use-sse";
              
const sseOptions = useMemo(
    () => ({
      method: "GET" as const,
      autoConnect: false,
      maxEvents: 20,
      formatMessage: (data: string) => {
        try {
          const d = JSON.parse(data);
          return {
            user: d.user,
            title: d.title,
            wiki: d.wiki,
          };
        } catch (e) {
          return data;
        }
      },
      eventListeners: {
        onOpen: (event: any) => console.log("连接建立:", event),
        onMessage: (data: any, event: any) => console.log("收到消息:", data),
        onError: (event: any) => console.error("连接错误:", event.error),
        onClose: (event: any) => console.log("连接关闭:", event),
      },
    }),
    []
  );

const { state, eventHistory, connect, disconnect, reconnect, clearMessages } =
    useSSE("/v2/stream/recentchange", sseOptions);

  return (
    <div>
      <p>Status: {state.connectionStatus}</p>
      <button onClick={connect}>Connect</button>
    </div>
  );
}`}
            </pre>
          </Card>

          {/* 实时日志区 */}
          <Card
            type="inner"
            title="实时消息日志 (Event History)"
            size="small"
            style={{ minHeight: 300 }}
          >
            <div style={{ maxHeight: 400, overflow: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {eventHistory.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 0",
                      borderBottom: `1px solid ${token.colorBorderSecondary}`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text type="secondary" style={{ marginRight: 16 }}>
                      [{item.timestamp.toLocaleTimeString()}]
                    </Text>
                    <div style={{ marginRight: 8 }}>
                      {item.type === "open" && <Tag color="blue">OPEN</Tag>}
                      {item.type === "close" && <Tag color="orange">CLOSE</Tag>}
                      {item.type === "error" && <Tag color="red">ERROR</Tag>}
                      {item.type === "message" && (
                        <Tag color="green">MESSAGE</Tag>
                      )}
                    </div>

                    {/* 显示消息内容，非 Message 类型显示特定信息 */}
                    <Text
                      code={item.type === "message"}
                      style={{ wordBreak: "break-all", flex: 1 }}
                    >
                      {typeof item.data === "object"
                        ? JSON.stringify(item.data)
                        : String(item.data)}
                    </Text>
                  </div>
                ))}
              </div>
              {eventHistory.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: token.colorTextDescription,
                  }}
                >
                  暂无消息，请点击"开始连接"模拟接收
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default SseExample;
