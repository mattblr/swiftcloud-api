export {};

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const Key = require("../../models/key");
const User = require("../../models/user");

const createAPIKey = async (args: any, req: any) => {
  if (!req.isAuth) {
    throw new Error("Not authorized!");
  }

  try {
    const user = await User.findOne({
      _id: req.userId,
    });

    const token = await jwt.sign(
      {
        createdBy: user.email,
        createdOn: new Date(),
      },
      process.env.JWTDECODER
    );

    const exisitingKey = await Key.findOne({
      user: req.userId,
      active: true,
    });

    if (exisitingKey) {
      await exisitingKey.updateOne({
        $set: {
          active: false,
        },
      });
    }
    const newKey = await new Key({
      key: token,
      active: true,
      user: req.userId,
    });

    const result = newKey.save();

    return result;
  } catch (error) {
    throw error;
  }
};
const retrieveAPIKey = async (args: any, req: any) => {
  if (!req.isAuth) {
    throw new Error("Not authorized!");
  }

  try {
    const key = await Key.findOne({
      user: req.userId,
      active: true,
    });

    if (key) {
      return key.key;
    } else {
      const res = await createAPIKey(args, req);
      return res.key;
    }
  } catch (error) {
    throw error;
  }
};

const generateNewAPIKey = async (args: any, req: any) => {
  if (!req.isAuth) {
    throw new Error("Not authorized!");
  }

  try {
    const user = await User.findOne({ _id: req.userId });

    const isEqual = await bcrypt.compare(args.password, user.password);
    if (isEqual) {
      const key = await Key.findOne({
        user: req.userId,
        active: true,
      });

      if (key) {
        await key.updateOne({
          $set: {
            active: false,
          },
        });

        const newKey = await createAPIKey(args, req);

        return newKey.key;
      }
    } else {
      throw new Error("Password incorrect!");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAPIKey,
  retrieveAPIKey,
  generateNewAPIKey,
};
