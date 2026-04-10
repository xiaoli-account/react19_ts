/** @format */

// 用户控制器 - 使用 SQLite 数据库存储数据

import { Context } from "koa";
import { UserDAO, User } from "../dao/user.dao";

export class UserController {
  static getUsers = async (ctx) => {
    try {
      const users = await UserDAO.getAllUsers();
      ctx.body = { users };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Failed to fetch users", error: error.message };
    }
  };

  static getUserById = async (ctx) => {
    try {
      const userId = parseInt(ctx.params.id);
      if (isNaN(userId)) {
        ctx.status = 400;
        ctx.body = { message: "Invalid user ID" };
        return;
      }

      const user = await UserDAO.getUserById(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "User not found" };
        return;
      }

      ctx.body = user;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Failed to fetch user", error: error.message };
    }
  };

  static createUser = async (ctx) => {
    try {
      const userData = ctx.request.body;

      if (!userData.name) {
        ctx.status = 400;
        ctx.body = { message: "Name is required" };
        return;
      }

      const user = await UserDAO.createUser({
        name: userData.name,
        email: userData.email,
      });

      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      if (error.message && error.message.includes("UNIQUE constraint failed")) {
        ctx.status = 400;
        ctx.body = { message: "Email already exists" };
      } else {
        ctx.status = 500;
        ctx.body = { message: "Failed to create user", error: error.message };
      }
    }
  };

  static updateUser = async (ctx) => {
    try {
      const userId = parseInt(ctx.params.id);
      if (isNaN(userId)) {
        ctx.status = 400;
        ctx.body = { message: "Invalid user ID" };
        return;
      }

      const userData = ctx.request.body;
      const user = await UserDAO.updateUser(userId, userData);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "User not found" };
        return;
      }

      ctx.body = user;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Failed to update user", error: error.message };
    }
  };

  static deleteUser = async (ctx) => {
    try {
      const userId = parseInt(ctx.params.id);
      if (isNaN(userId)) {
        ctx.status = 400;
        ctx.body = { message: "Invalid user ID" };
        return;
      }

      const deleted = await UserDAO.deleteUser(userId);

      if (!deleted) {
        ctx.status = 404;
        ctx.body = { message: "User not found" };
        return;
      }

      ctx.body = { message: "User deleted successfully" };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Failed to delete user", error: error.message };
    }
  };
}
