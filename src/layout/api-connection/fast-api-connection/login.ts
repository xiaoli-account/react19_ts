/**
 * fastapi服务 登录相关接口路径与类型配置
 *
 * @format
 */
import type { LoginInfo, RegisterInfo, UserInfo } from "@/store/user";

/**
 * 登录请求参数类型
 * @description FastApi后台服务的请求参数数据类型
 */
interface FastApiLoginParams {
  username?: string;
  password?: string;
  captcha?: string;
  captcha_key?: string;
  remember?: boolean;
  login_type?: string;
}
/**
 * 登录响应值类型
 * @description FastApi后台服务的响应值类型
 */
interface FastApiLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
}

/**
 * 注册请求参数类型
 * @description FastApi后台服务的请求参数数据类型
 */
interface FastApiRegisterParams {
  loginName: string;
  password: string;
  email: string;
  nickname?: string;
  phone?: string;
}

/**
 * 用户信息响应值类型
 * @description FastApi后台服务的响应值类型
 */
type FastApiUserInfoResponse = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  description: string;
  email: string;
  created_time: string;
  updated_time: string;

  roles: any[];
  dept: any[];
  menus: any[];
  btns: any[];
  apis: any[];
  pages: any[];
};

export default {
  /**
   * 登录接口
   */
  login: {
    path: "/system/auth/login",
    method: "POST" as const,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    customTransformParams: (data: LoginInfo): FastApiLoginParams => ({
      // 接口参数名称：内部参数名称
      username: data.loginName,
      password: data.password,
      captcha: data.captcha,
      captcha_key: data.captcha_key,
      remember: data.remember,
      login_type: "PC端",
    }),
    customTransformResponse: (data: FastApiLoginResponse): string => {
      // 内部响应值名称:接口响应值 FastApiLoginResponse 名称
      return data.access_token;
    },
  },

  /**
   * 登出接口
   */
  logout: {
    path: "/system/auth/logout",
    method: "POST" as const,
    customTransformParams: (token: string) => token,
    customTransformResponse: (data: any) => data,
  },

  /**
   * 注册用户接口
   */
  registerUser: {
    path: "/user/registerUser",
    method: "POST" as const,
    customTransformParams: (data: RegisterInfo): FastApiRegisterParams => ({
      loginName: data.loginName,
      password: data.password,
      email: data.email,
      nickname: data.name,
      phone: data.phone,
    }),
    customTransformResponse: (data: any) => data,
  },

  /**
   * 获取登录用户信息接口
   */
  getUserInfo: {
    path: "/system/user/current/info",
    method: "GET" as const,
    customTransformResponse: (data: FastApiUserInfoResponse): UserInfo => ({
      // 内部响应值名称:接口响应值 FastApiUserInfoResponse 名称
      id: data.id,
      nickname: data.name,
      loginName: data.username,
      email: data.email,
      description: data.description,
      avatar: data.avatar,
      roles: data.roles,
      routes: data.menus,
      dept: data.dept,
      pages: data.pages,
      btns: data.btns,
      apis: data.apis,
      createdAt: data.created_time,
      updatedAt: data.updated_time,
    }),
  },

  /**
   * 检查token是否有效接口
   */
  checkToken: {
    path: "/validateToken",
    method: "POST" as const,
    customTransformParams: (token?: string) => ({ token }),
    customTransformResponse: (data: any): boolean => data,
  },
  getVerificationCode: {
    path: "/system/auth/captcha/get",
    method: "GET" as const,
  },
};
