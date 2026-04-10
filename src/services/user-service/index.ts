/** @format */

import { $get, $post } from "@/layout/utils/request";
import {
  LeeLoggerMethod,
  OPERATION_TYPE,
  LOG_LEVEL,
} from "@/layout/utils/leeLogger";
import apiConnection from "@/layout/api-connection";
import type { UserInfo } from "@/store/user";

export class UserService {
  /**
   * 获取登录用户信息
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  getUserInfo() {
    return $get(
      apiConnection.user.getUserInfo.path,
      {},
      {
        customTransformResponse:
          apiConnection.user.getUserInfo.customTransformResponse,
      }
    );
  }

  /**
   * 密码校验
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  validateUserPassword(passWord: object) {
    return $post(apiConnection.user.validateUserPassword.path, passWord, {
      customTransformParams:
        apiConnection.user.validateUserPassword.customTransformParams,
    });
  }

  /**
   * 更新密码
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.UPDATE,
  })
  updatePassword(userForm: object) {
    return $post(apiConnection.user.updatePassword.path, userForm, {
      customTransformParams:
        apiConnection.user.updatePassword.customTransformParams,
    });
  }

  /**
   * 根据ID查找用户
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  findUserById(id: string) {
    return $get(apiConnection.user.findUserById.path, id, {
      customTransformParams:
        apiConnection.user.findUserById.customTransformParams,
      customTransformResponse:
        apiConnection.user.findUserById.customTransformResponse,
    });
  }

  /**
   * 更新用户信息
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.UPDATE,
  })
  update(data: UserInfo) {
    return $post(apiConnection.user.update.path, data, {
      customTransformParams: apiConnection.user.update.customTransformParams,
    });
  }

  /**
   * 分页获取用户列表
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.READ,
  })
  pageList(data: object) {
    return $get(apiConnection.user.pageList.path, data, {
      customTransformParams: apiConnection.user.pageList.customTransformParams,
      customTransformResponse:
        apiConnection.user.pageList.customTransformResponse,
    });
  }

  /**
   * 保存或更新用户
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.INFO,
    operation: OPERATION_TYPE.UPDATE,
  })
  saveOrUpdateUser(data: object) {
    return $post(apiConnection.user.saveOrUpdateUser.path, data, {
      customTransformParams:
        apiConnection.user.saveOrUpdateUser.customTransformParams,
    });
  }

  /**
   * 级联删除用户
   */
  @LeeLoggerMethod({
    level: LOG_LEVEL.WARN,
    operation: OPERATION_TYPE.DELETE,
  })
  deleteUserCascade(id: string) {
    return $post(apiConnection.user.deleteUserCascade.path, id, {
      customTransformParams:
        apiConnection.user.deleteUserCascade.customTransformParams,
    });
  }
}
