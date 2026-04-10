/** @format */

import { $get, $post } from "@/layout/utils/request";
import type { LoginInfo, RegisterInfo } from "@/store/user";
import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";
import apiConnection from "@/layout/api-connection";

export class LoginService {
  /**
   * 认证相关接口
   */

  // 登录
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGIN,
  })
  login(params: LoginInfo) {
    return $post(apiConnection.login.login.path, params, {
      customTransformParams: apiConnection.login.login.customTransformParams,
      customTransformResponse:
        apiConnection.login.login.customTransformResponse,
    });
  }

  // 登出
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.LOGOUT,
  })
  logout() {
    return $post(
      apiConnection.login.logout.path,
      {},
      {
        customTransformParams: apiConnection.login.logout.customTransformParams,
        customTransformResponse:
          apiConnection.login.logout.customTransformResponse,
      }
    );
  }

  // 注册用户
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.REGISTER,
  })
  registerUser(data: RegisterInfo) {
    return $post(apiConnection.login.registerUser.path, data, {
      customTransformParams:
        apiConnection.login.registerUser.customTransformParams,
      customTransformResponse:
        apiConnection.login.registerUser.customTransformResponse,
    });
  }

  /**
   * 获取登录用户信息
   * @returns
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户管理",
    operation: OPERATION_TYPE.READ,
  })
  getUserInfo() {
    return $get(
      apiConnection.login.getUserInfo.path,
      {},
      {
        customTransformResponse:
          apiConnection.login.getUserInfo.customTransformResponse,
      }
    );
  }

  /**
   * 检查token是否有效
   * @returns Promise<boolean>
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.READ,
  })
  checkToken(token?: string) {
    return $post(apiConnection.login.checkToken.path, token, {
      customTransformParams:
        apiConnection.login.checkToken.customTransformParams,
      customTransformResponse:
        apiConnection.login.checkToken.customTransformResponse,
    })
      .then((res) => {
        // 经过 transformResponse 后的 res 直接就是布尔值
        return res.data;
      })
      .catch((err) => {
        console.error("checkToken", err);
        return false;
      });
  }
  /**
   * 获取登录图形验证码
   * @returns Promise<boolean>
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    module: "用户认证",
    operation: OPERATION_TYPE.READ,
  })
  getVerificationCode() {
    return $get(
      apiConnection.login.getVerificationCode.path,
      {},
      {
        customTransformResponse:
          apiConnection.login.getVerificationCode.customTransformResponse,
      }
    );
  }
}
