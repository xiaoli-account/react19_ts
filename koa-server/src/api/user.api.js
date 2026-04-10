// src/api/user.api.ts
import Router from 'koa-router';
import { UserController } from '../src/controllers/user.controller';

const userRouter = new Router();

// 用户路由
userRouter.get('/api/users', UserController.getUsers);
userRouter.get('/api/users/:id', UserController.getUserById);
userRouter.post('/api/users', UserController.createUser);
userRouter.put('/api/users/:id', UserController.updateUser);
userRouter.delete('/api/users/:id', UserController.deleteUser);

export default userRouter;