/** @format */

import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Upload,
  message,
  Typography,
  Divider,
  theme,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  $get,
  $post,
  $put,
  $delete,
  $upload,
  $download,
} from "@/layout/utils/request";
import type { UploadFile } from "antd/es/upload/interface";

const { Title, Paragraph, Text } = Typography;

const AjaxExample = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [method, setMethod] = useState<string>("");

  // 模拟 GET 请求
  const handleGet = async () => {
    setLoading("get");
    setMethod("GET");
    setResult({
      success: true,
      code: 200,
      message: "请求成功",
      data: {
        id: 1,
        name: "test_user",
        age: 18,
      },
    });
    // try {
    //   // 示例接口：获取用户列表
    //   const res = await $get("/mock/users", { page: 1, pageSize: 10 });
    //   setResult(res);
    //   message.success("GET 请求成功");
    // } catch (error) {
    //   setResult({ error: "请求失败，请确保后端服务正常" });
    // } finally {
    //   setLoading("");
    // }
  };

  // 模拟 POST 请求
  const handlePost = async () => {
    setLoading("post");
    setMethod("POST");
    setResult({
      success: true,
      code: 200,
      message: "请求成功",
      data: {
        id: 1,
        name: "test_user",
        age: 18,
      },
    });
    // try {
    //   // 示例接口：创建用户
    //   const res = await $post("/mock/user", {
    //     username: "test_user",
    //     age: 18,
    //   });
    //   setResult(res);
    //   message.success("POST 请求成功");
    // } catch (error) {
    //   setResult({ error: "请求失败" });
    // } finally {
    //   setLoading("");
    // }
  };

  // 模拟 PUT 请求
  const handlePut = async () => {
    setLoading("put");
    setMethod("PUT");
    setResult({
      success: true,
      code: 200,
      message: "请求成功",
      data: {
        id: 1,
        name: "test_user",
        age: 18,
      },
    });
    // try {
    //   // 示例接口：更新用户信息
    //   const res = await $put("/mock/user/1", {
    //     username: "updated_user",
    //   });
    //   setResult(res);
    //   message.success("PUT 请求成功");
    // } catch (error) {
    //   setResult({ error: "请求失败" });
    // } finally {
    //   setLoading("");
    // }
  };

  // 模拟 DELETE 请求
  const handleDelete = async () => {
    setLoading("delete");
    setMethod("DELETE");
    setResult({
      success: true,
      code: 200,
      message: "请求成功",
      data: {
        id: 1,
        name: "test_user",
        age: 18,
      },
    });
    // try {
    //   // 示例接口：删除用户
    //   const res = await $delete("/mock/user/1");
    //   setResult(res);
    //   message.success("DELETE 请求成功");
    // } catch (error) {
    //   setResult({ error: "请求失败" });
    // } finally {
    //   setLoading("");
    // }
  };

  // 模拟上传
  const handleUpload = async (file: File) => {
    setLoading("upload");
    setMethod("UPLOAD");
    // try {
    //   const res = await $upload("/mock/upload", file);
    //   setResult(res);
    //   message.success("文件上传成功");
    // } catch (error) {
    //   setResult({ error: "上传失败" });
    // } finally {
    //   setLoading("");
    // }
  };

  // 模拟下载
  const handleDownload = async () => {
    setLoading("download");
    setMethod("DOWNLOAD");
    // try {
    //   await $download("/mock/download/report.xlsx", "report.xlsx");
    //   message.success("下载开始");
    // } catch (error) {
    //   setResult({ error: "下载失败" });
    // } finally {
    //   setLoading("");
    // }
  };

  return (
    <div className="ajax-example-container">
      <Card title="Ajax 请求示例 (Based on Axios)" variant="borderless">
        <Paragraph>
          本页面演示了统一封装的 HTTP 请求方法的使用，包含 <Text code>GET</Text>
          、<Text code>POST</Text>、<Text code>PUT</Text>、
          <Text code>DELETE</Text> 以及 文件
          <Text code>Upload</Text> / <Text code>Download</Text>。
        </Paragraph>

        <Card
          type="inner"
          title="开发环境代理配置 (Vite Proxy)"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Paragraph style={{ marginBottom: 0 }}>
            <Text strong>API 前缀:</Text> <Text code>/dev-api</Text>
            <br />
            <Text strong>目标地址:</Text>{" "}
            <Text code>http://192.168.0.194:9619</Text> (VITE_APP_API_URL)
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              说明: 请求 <Text code>/dev-api/...</Text> 会被代理到{" "}
              <Text code>http://192.168.0.194:9619/...</Text>
            </Text>
          </Paragraph>
        </Card>

        <Divider titlePlacement="left">基础请求方法</Divider>
        <Space wrap size="middle">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={loading === "get"}
            onClick={handleGet}
          >
            GET 查询
          </Button>

          <Button
            type="primary"
            style={{ backgroundColor: token.colorSuccess }}
            icon={<PlusOutlined />}
            loading={loading === "post"}
            onClick={handlePost}
          >
            POST 新增
          </Button>

          <Button
            type="primary"
            style={{ backgroundColor: token.colorWarning }}
            icon={<EditOutlined />}
            loading={loading === "put"}
            onClick={handlePut}
          >
            PUT 更新
          </Button>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={loading === "delete"}
            onClick={handleDelete}
          >
            DELETE 删除
          </Button>
        </Space>

        <Divider titlePlacement="left">文件操作</Divider>
        <Space wrap size="middle">
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // 阻止默认上传行为
            }}
            showUploadList={false}
          >
            <Button
              icon={<CloudUploadOutlined />}
              loading={loading === "upload"}
            >
              Upload 上传
            </Button>
          </Upload>

          <Button
            icon={<DownloadOutlined />}
            loading={loading === "download"}
            onClick={handleDownload}
          >
            Download 下载
          </Button>
        </Space>

        <Divider titlePlacement="left">
          代码调用示例 & 响应结果 {method && `[${method}]`}
        </Divider>

        <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
          {/* 代码展示区 */}
          <Card
            type="inner"
            title="调用代码"
            size="small"
            style={{ backgroundColor: token.colorFillAlter }}
          >
            <pre style={{ margin: 0, fontSize: 13 }}>
              {method === "GET" &&
                `import { $get } from "@/layout/utils/request";
// GET 请求示例
const res = await $get('/mock/users', { page: 1, pageSize: 10 });`}
              {method === "POST" &&
                `import { $post } from "@/layout/utils/request";
// POST 请求示例
const res = await $post('/mock/user', { username: 'test_user', age: 18 });`}
              {method === "PUT" &&
                `import { $put } from "@/layout/utils/request";
// PUT 请求示例
const res = await $put('/mock/user/1', { username: 'updated_user' });`}
              {method === "DELETE" &&
                `import { $delete } from "@/layout/utils/request";
// DELETE 请求示例
const res = await $delete('/mock/user/1');`}
              {method === "UPLOAD" &&
                `import { $upload } from "@/layout/utils/request";
// 上传示例
const formData = new FormData();
formData.append('file', file);
const res = await $upload('/mock/upload', file);`}
              {method === "DOWNLOAD" &&
                `import { $download } from "@/layout/utils/request";
// 下载示例
await $download('/mock/download/report.xlsx', 'report.xlsx');`}
              {!method && "// 请点击上方按钮查看示例代码"}
            </pre>
          </Card>

          {/* 结果展示区 */}
          <Card
            type="inner"
            title="响应结果 (Response Data)"
            size="small"
            style={{ minHeight: 120 }}
          >
            {result ? (
              <pre
                style={{
                  margin: 0,
                  fontSize: 13,
                  maxHeight: 300,
                  overflow: "auto",
                  color: result.error ? token.colorError : token.colorSuccess,
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">暂无数据</Text>
            )}
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AjaxExample;
