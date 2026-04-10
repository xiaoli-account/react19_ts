/** @format */

import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { message } from "../../utils/globalAntd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUserStore } from "@/store/user";
import { clearAllCache } from "../../utils";
import { navigationService } from "./navigation";
import { REQUEST_LOG_META } from "./leeLogger";
import { hasApiPermission } from "./leePermission";

// 配置 NProgress
NProgress.configure({ showSpinner: false });

// 分页参数类型
export interface PageNumber {
  pageNum: number;
  pageSize: number;
}

// 请求响应接口
export interface ApiResponse<T = any> {
  code: number;
  data: any;
  list?: T;
  message: string;
  success: boolean;
  msg: string;
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 跳过全局错误处理
  skipLoading?: boolean; // 跳过加载状态
  customTransformParams?: (data: any) => any; // 转换请求参数
  customTransformResponse?: (data: any) => any; // 转换响应值
  /**
   * 索引签名：允许扩展任意未声明字段
   */
  [key: string]: any;
}

/**
 * 优化后的文件名提取工具函数
 * 支持 filename 和 filename* (RFC 5987)
 */
function getFileName(response) {
  const disposition = response.headers["content-disposition"];
  if (!disposition) {
    return `download_${new Date().getTime()}`;
  }

  let filename = "";

  // 1. 优先尝试匹配 filename* (支持 UTF-8 编码)
  // 匹配格式如：filename*=utf-8''%E4%BD%A0%E5%A5%BD.zip
  const filenameStarRegex = /filename\*=[^']+'[^']*'([^;\n]+)/;
  const starMatches = filenameStarRegex.exec(disposition);
  if (starMatches && starMatches[1]) {
    filename = decodeURIComponent(starMatches[1]);
  }

  // 2. 如果没有 filename*，则匹配普通的 filename
  if (!filename) {
    const filenameRegex = /filename=([^;\n]+)/;
    const matches = filenameRegex.exec(disposition);
    if (matches && matches[1]) {
      // 移除引号并解码
      filename = decodeURIComponent(matches[1].replace(/['"]/g, ""));
    }
  }

  return filename || "unnamed_file";
}
class Request {
  public instance: AxiosInstance;

  constructor() {
    const isDev = import.meta.env.DEV;
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      // 使用qs库对查询参数进行序列化,防止参数默认序列化导致传参异常情况
      paramsSerializer: {
        serialize(params) {
          return qs.stringify(params, {
            allowDots: true,
            arrayFormat: "repeat",
          });
        },
      },
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 需要使用自定义属性时，使用requestConfig
        const requestConfig = config as RequestConfig;
        // 转换请求参数
        if (
          requestConfig.customTransformParams &&
          typeof requestConfig.customTransformParams === "function"
        ) {
          // 分别处理get参数类型params与post参数类型data
          if (config.data) {
            config.data = requestConfig.customTransformParams(config.data);
          }
          if (config.params) {
            config.params = requestConfig.customTransformParams(config.params);
          }
        }
        // 校验接口级权限
        if (!hasApiPermission(config.url as string)) {
          // 构造权限错误
          const error: any = {
            message: "您没有权限访问此接口",
            code: "PERMISSION_DENIED",
            permission: config.url,
            skipErrorHandler: true,
          };
          return Promise.reject(error);
        }

        // 显示加载进度
        if (!requestConfig.skipLoading) {
          NProgress.start();
        }
        // 添加 token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        NProgress.done();
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        NProgress.done();
        const requestConfig = response.config as RequestConfig;
        let responseData =
          typeof response.data === "string"
            ? JSON.parse(response.data)
            : response.data;
        // 文件流响应判断
        // 判断是否为 Blob 对象（流文件）
        if (responseData instanceof Blob) {
          // 确实是文件流，直接返回整个 response
          // (因为下载需要获取 headers 里的 filename)
          const responseFilename = getFileName(response);
          return { ...response, filename: responseFilename };
        }
        // 检查业务状态码 (使用当前最新的 responseData)
        if (
          !responseData.success &&
          (responseData.code !== 200 || responseData.status_code !== 200)
        ) {
          // skipErrorHandler 时跳过全局错误处理，将原始响应交给调用方自行判断
          if (requestConfig?.skipErrorHandler) {
            return response;
          }
          this.handleBusinessError(responseData);
          return Promise.reject(new Error(responseData.message || "请求失败"));
        }
        // 2. 校验通过后，再进行自定义的数据转换
        if (
          requestConfig.customTransformResponse &&
          typeof requestConfig.customTransformResponse === "function"
        ) {
          responseData.data = requestConfig.customTransformResponse(
            responseData.data
          );
          response.data = responseData;
        }

        return response;
      },
      (error: AxiosError) => {
        NProgress.done();

        const config = error.config as RequestConfig;
        // 权限错误
        if (error.code === "PERMISSION_DENIED") {
          return Promise.reject(error);
        }
        // 跳过错误处理
        if (config?.skipErrorHandler) {
          return Promise.reject(error);
        }

        // 处理 HTTP 错误
        this.handleHttpError(error);
        return Promise.reject(error);
      }
    );
  }

  // 获取 token
  private getToken(): string | undefined {
    // 使用 user store 的 getToken 方法
    // getToken 返回 string | undefined
    return useUserStore.getState().getToken();
  }

  // 处理业务错误
  private handleBusinessError(data: ApiResponse) {
    const { code, message: msg } = data;

    switch (code) {
      case 401:
        // 未授权，跳转登录
        this.handleUnauthorized();
        break;
      case 403:
        message.error("没有权限访问该资源");
        setTimeout(() => navigationService.replace("/403"), 1500);
        break;
      case 404:
        message.error("请求的资源不存在");
        setTimeout(() => navigationService.replace("/404"), 1500);
        break;
      case 500:
        message.error(msg);
        // message.error("服务器内部错误");
        // setTimeout(() => navigationService.replace("/500"), 1500);
        break;
      case 502:
        message.error("网关错误");
        setTimeout(() => navigationService.replace("/502"), 1500);
        break;
      case 503:
        message.error("服务不可用");
        setTimeout(() => navigationService.replace("/503"), 1500);
        break;
      case 504:
        message.error("网关超时");
        setTimeout(() => navigationService.replace("/504"), 1500);
        break;
      default:
        message.error(msg || "请求失败");
    }
  }

  // 处理 HTTP 错误
  private handleHttpError(error: AxiosError) {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          message.error("没有权限访问该资源");
          setTimeout(() => navigationService.replace("/403"), 1500);
          break;
        case 404:
          message.error("请求的资源不存在");
          setTimeout(() => navigationService.replace("/404"), 1500);
          break;
        case 500:
          // 检查是否登录成功
          const token = this.getToken();
          if (!token) {
            // 返回登录页面
            setTimeout(() => navigationService.replace("/login"), 1500);
            return;
          }
          message.error(data.msg);

          // message.error("服务器内部错误");
          // setTimeout(() => navigationService.replace("/500"), 1500);
          break;
        case 502:
          message.error("网关错误");
          setTimeout(() => navigationService.replace("/502"), 1500);
          break;
        case 503:
          message.error("服务不可用");
          setTimeout(() => navigationService.replace("/503"), 1500);
          break;
        case 504:
          message.error("网关超时");
          setTimeout(() => navigationService.replace("/504"), 1500);
          break;
        default:
          message.error(`请求失败: ${status}`);
      }
    } else if (error.code === "ECONNABORTED") {
      message.error("请求超时");
    } else {
      message.error("网络错误");
    }
  }

  // 处理未授权
  private handleUnauthorized() {
    message.error("登录已过期，请重新登录");
    // 清除 全部缓存
    clearAllCache();
    // 跳转到 401 错误页面
    setTimeout(() => navigationService.replace("/401"), 1500);
  }

  // GET 请求
  get<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (data) {
      config = {
        ...config,
        params: data,
      };
    }
    const promise = this.instance
      .get(url, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, data, method: "GET" };

    return promise;
  }

  // GET 请求
  getById<T = any>(
    url: string,
    id?: any,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (data) {
      config = {
        ...config,
        params: data,
      };
    }
    const promise = this.instance
      .get(url + "/" + id, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, id, method: "GET" };

    return promise;
  }

  // GET 请求 (将参数拼接在 url 后)
  getParams<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    let requestUrl = url;
    if (data !== undefined && data !== null) {
      if (typeof data === "object") {
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
        );
        const query = new URLSearchParams(cleanData as any).toString();
        if (query) {
          requestUrl += (requestUrl.includes("?") ? "&" : "?") + query;
        }
      } else {
        requestUrl += (requestUrl.endsWith("/") ? "" : "/") + data;
      }
    }

    const promise = this.instance
      .get(requestUrl, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = {
      url: requestUrl,
      data,
      method: "GET",
    };

    return promise;
  }

  /**
   * POST 请求
   * @param url 接口地址
   * @param data 请求参数
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const promise = this.instance
      .post(url, data, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, data, method: "POST" };

    return promise;
  }
  // POST 请求
  postById<T = any>(
    url: string,
    id?: any,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const promise = this.instance
      .post(url + "/" + id, data, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, id, data, method: "POST" };

    return promise;
  }

  // PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const promise = this.instance
      .put(url, data, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, data, method: "PUT" };

    return promise;
  }
  // PUT 请求
  putById<T = any>(
    url: string,
    id?: any,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const promise = this.instance
      .put(url + "/" + id, data, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, id, data, method: "PUT" };

    return promise;
  }

  // DELETE 请求
  delete<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (data) {
      config = {
        ...config,
        data: data,
      };
    }
    const promise = this.instance
      .delete(url, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, data, method: "DELETE" };

    return promise;
  }
  // DELETE 请求
  deleteById<T = any>(
    url: string,
    id?: any,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (data) {
      config = {
        ...config,
        params: data,
      };
    }
    const promise = this.instance
      .delete(url + "/" + id, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, id, data, method: "DELETE" };

    return promise;
  }
  // PATCH 请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const promise = this.instance
      .patch(url, data, config)
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = { url, data, method: "PATCH" };

    return promise;
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const promise = this.instance
      .post(url, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);

    // 注入元数据供 LeeLogger 识别
    (promise as any)[REQUEST_LOG_META] = {
      url,
      data: "FormData",
      method: "UPLOAD",
    };

    return promise;
  }

  // 下载文件
  download(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    if (url.indexOf("http") != -1) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return Promise.resolve();
    }
    return this.instance
      .request({
        url,
        method: config?.method || "GET",
        ...config,
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = response.filename || filename || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => {
        console.error("文件下载失败", err);
      });
  }
}

// 创建请求实例
export const request = new Request();

// 绑定方法到实例，避免 this 上下文丢失
export const $get = request.get.bind(request);
export const $getParams = request.getParams.bind(request);
export const $getById = request.getById.bind(request);
export const $post = request.post.bind(request);
export const $postById = request.postById.bind(request);
export const $put = request.put.bind(request);
export const $putById = request.putById.bind(request);
export const $delete = request.delete.bind(request);
export const $deleteById = request.deleteById.bind(request);
export const $patch = request.patch.bind(request);
export const $upload = request.upload.bind(request);
export const $download = request.download.bind(request);

// 导出 axios 实例（用于特殊场景）
export const httpInstance = request.instance;
