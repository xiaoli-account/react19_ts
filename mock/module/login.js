/** @format */

const Mock = require("mockjs");
const { success200 } = require("../config/response");
const { API_BEFORE_URL } = require("../config/api-url");

module.exports = [
  {
    [API_BEFORE_URL + "/login"]: {
      method: "post",
      response: (req) => ({
        ...success200,
        data: Mock.mock("@guid"),
      }),
    },
    [API_BEFORE_URL + "/getUserInfo"]: {
      method: "get",
      response: (req) => ({
        ...success200,
        data: Mock.mock({
          id: "@id",
          loginName: "@word(5, 10)",
          name: "@cname",
          phone: /^1[3-9]\d{9}$/,
          email: "@email",
          avatar: "@image('100x100', '#50B347', '#FFF', 'Avatar')",
        }),
      }),
    },
    [API_BEFORE_URL + "/logout"]: {
      method: "post",
      response: (req) => ({
        ...success200,
        data: {
          message: Mock.mock("@sentence(3, 5)"),
        },
      }),
    },
  },
];
