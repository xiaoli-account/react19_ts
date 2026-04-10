/** @format */

// 登录控制器

import { LoginDAO } from "../dao/login.dao";

// 模拟的 JWT token（在实际应用中应该使用真正的 JWT 库生成）
const JWT_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySnNvbiI6IntcImN1cnJlbnRcIjoxLFwiZGVsRmxhZ1wiOjAsXCJpZFwiOlwiMVwiLFwibGFzdExvZ2luVGltZVwiOlwiMjAyNS0xMS0yNCAwOToxMjowNVwiLFwibG9naW5OYW1lXCI6XCJhZG1pblwiLFwibmFtZVwiOlwi6LaF57qn566h55CG5ZGYXCIsXCJwYXNzd29yZFwiOlwie2JjcnlwdH0kMmEkMTAkQlZEc0kuUnlIWkZ3ZnguSk83WC9PZWdOQmJQaHVsS2VtUkcxU2p1b0syeAFFZ2FGMTBHeFdcIixcInBob25lXCI6XCIxNTk4ODg4ODg4OFwiLFwic2l6ZVwiOjMwLFwic3RhdHVzXCI6MCxcInVuaXRJZFwiOlwiMTMzNjkyODE1NTIyMTQzMDI3M1wiLFwidW5pdE5hbWVcIjpcIuagueiKgueCuVwiLFwidXBkYXRlQnlcIjpcIjFcIixcInVwZGF0ZURhdGVcIjpcIjIwMjUtMTEtMjAgMTY6MDA6MzhcIixcInZlcnNpb25cIjo0fSIsImV4cCI6MTk3OTk1MTg2MX0.shVSzqM7WxSLAdycC2NEQdLUe-bYI7PtJylvNhdSFpGY0oMKxrezXuQh9DbeAp7oUyGpjDXMn84IOQoMW2o5zg";

export class LoginController {
  static signIn = async (ctx) => {
    try {
      const { loginName, password } = ctx.request.body;

      // 验证用户凭据
      const isValid = await LoginDAO.validateUserPassword(loginName, password);

      if (isValid) {
        ctx.body = {
          code: 200,
          message: "success",
          data: JWT_TOKEN,
        };
      } else {
        ctx.status = 401;
        ctx.body = {
          code: 500,
          message: "账号或密码错误",
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "登录失败",
        error: error.message,
      };
    }
  };

  static signOut = async (ctx) => {
    try {
      // 在实际应用中，这里可能需要将 token 加入黑名单
      ctx.body = {
        code: 200,
        message: "success",
        data: null,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "退出登录失败",
        error: error.message,
      };
    }
  };

  static validateToken = async (ctx) => {
    try {
      const { token } = ctx.request.body;

      // 简单验证 token（在实际应用中应该使用 JWT 库验证）
      const isValid = token === JWT_TOKEN;

      if (isValid) {
        ctx.body = {
          code: 200,
          message: "success",
          data: isValid,
        };
      } else {
        ctx.status = 401;
        ctx.body = {
          code: 500,
          message: "Token无效",
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "Token验证失败",
        error: error.message,
      };
    }
  };
}
