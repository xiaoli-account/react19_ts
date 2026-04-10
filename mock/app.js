/** @format */

const express = require("express");
const cors = require("cors");
const setupMock = require("./module");

const app = express();

app.use(cors());
app.use(express.json());

// 注册 mock
setupMock(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.warn(`Mock server running at http://localhost:${PORT}`);
});
