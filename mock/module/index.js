/** @format */

const Mock = require("mockjs");
const login = require("./login");

function registerMockModule(app, moduleArray) {
  moduleArray.forEach((module) => {
    module.forEach((item) => {
      Object.entries(item).forEach(([url, config]) => {
        const { method, response } = config;
        app[method](url, (req, res) => {
          const result =
            typeof response === "function"
              ? response(req)
              : Mock.mock(response);
          res.json(result);
        });
      });
    });
  });
}

function setupMock(app) {
  // 注册所有 mock 模块
  registerMockModule(app, [login]);
}

module.exports = setupMock;
