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
  loginName?: string;
  password?: string;
  verificationCode?: string;
  mode: string;
}
/**
 * 登录响应值类型
 * @description FastApi后台服务的响应值类型
 */
type FastApiLoginResponse = string;

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
  nickname: string;
  description: string;
  roles: string[];
  permissions: string[];
  createTime: string;
  updateTime: string;
  loginName: string;
  email: string;
  avatar: string;
  phone: string;
};

export default {
  /**
   * 登录接口
   */
  login: {
    path: "/login",
    method: "POST" as const,
    customTransformParams: (data: LoginInfo): FastApiLoginParams => ({
      // 接口参数名称：内部参数名称
      loginName: data.account,
      password: data.password,
      verificationCode: data.verificationCode,
      mode: data.mode,
    }),
    customTransformResponse: (data: FastApiLoginResponse): string => {
      // 内部响应值名称:接口响应值 FastApiLoginResponse 名称
      return data;
    },
  },

  /**
   * 登出接口
   */
  logout: {
    path: "/logout",
    method: "POST" as const,
    customTransformParams: () => ({}),
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
    path: "/getUserInfo",
    method: "GET" as const,
    customTransformResponse: (data: FastApiUserInfoResponse): UserInfo => ({
      // 内部响应值名称:接口响应值 FastApiUserInfoResponse 名称
      id: data.id,
      nickname: data.nickname,
      loginName: data.loginName,
      email: data.email,
      description: data.description,
      avatar: data.avatar,
      phone: data.phone,
      roles: data.roles,
      permissions: data.permissions,
      createdAt: data.createTime,
      updatedAt: data.updateTime,
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

  /**
   * 获取图形验证码
   */
  getVerificationCode: {
    path: "/getVerificationCode",
    method: "GET" as const,
    customTransformResponse: (data: any) => data,
  },
};
