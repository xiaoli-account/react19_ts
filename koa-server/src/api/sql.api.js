// src/api/sql.api.ts
import Router from 'koa-router';
import { SQLController } from '../src/controllers/sql.controller';

const sqlRouter = new Router();

// SQL 查询路由
sqlRouter.get('/api/sql/tables', SQLController.getTables);
sqlRouter.get('/api/sql/tables/:tableName/schema', SQLController.getTableSchema);
sqlRouter.get('/api/sql/tables/:tableName/preview', SQLController.getTablePreview);
sqlRouter.post('/api/sql/query', SQLController.executeQuery);

export default sqlRouter;