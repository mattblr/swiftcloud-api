const authResolver = require("./auth");
const apiKeyResolver = require("./apikey");
const listenResolver = require("./listen");

const rootResolver = {
  ...authResolver,
  ...apiKeyResolver,
  ...listenResolver,
};

module.exports = rootResolver;
