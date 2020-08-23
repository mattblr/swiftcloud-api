export {};

const jwt = require("jsonwebtoken");

const Key = require("../models/key");

module.exports = async (req: any, res: any, next: any) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.keyAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.keyAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWTDECODER);
  } catch (err) {
    req.keyAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.keyAuth = false;
    return next();
  }
  let validKey;
  try {
    validKey = await Key.findOne({
      key: token,
      active: true,
    });
  } catch (err) {
    req.keyAuth = false;
    return next();
  }

  if (!validKey) {
    req.keyAuth = false;
    return next();
  }
  req.keyAuth = true;
  req.userId = decodedToken.user;
  next();
};
