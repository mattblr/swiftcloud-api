const isAuth = require("./is-auth");
const keyAuth = require("./key-auth");

const rootMiddleware = [isAuth, keyAuth];

module.exports = rootMiddleware;
