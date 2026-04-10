import Router from 'koa-router';

// 导入模块化路由
import userRouter from '../api/user.api';
import sqlRouter from '../api/sql.api';

const router = new Router();

// 使用模块化路由
router.use(userRouter.routes());
router.use(productRouter.routes());
router.use(sqlRouter.routes());
router.use(authRouter.routes());
router.use(userinfoRouter.routes());
router.use(fileRouter.routes());
router.use(knowledgebaseRouter.routes());
router.use(studioappsRouter.routes());

// 简单的健康检查接口
router.get('/health', async (ctx) => {
  ctx.body = { status: 'OK', timestamp: new Date().toISOString() };
});

// 基础路由
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello, Koa + TypeScript Server!' };
});

export { router as appRouter };