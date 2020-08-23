export {};

const bcrypt = require("bcryptjs");
const User = require("../../models/user");

const jwt = require("jsonwebtoken");
const { transformUser } = require("../../helpers/merge");

module.exports = {
  createUser: async (args: any, req: any) => {
    // if (!req.isAuth) {
    //   throw new Error("Not authorized!");
    // }
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
        name: args.userInput.name || null,
      });

      const result = await newUser.save();
      return transformUser(result);
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }: any) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Please check your details and try again");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Please check your details and try again");
    }

    const token = await jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWTDECODER,
      { expiresIn: "1h" }
    );
    return {
      userId: user.id,
      email: user.email,
      token: token,
      name: user.name,
      tokenExpiration: "1",
    };
  },

  changePassword: async (args: any, req: any) => {
    if (!req.isAuth) {
      throw new Error("Not authorized!");
    }
    try {
      const user = await User.findOne({ _id: req.userId });

      const isEqual = await bcrypt.compare(args.password, user.password);

      if (!isEqual) {
        throw new Error("Please check your details and try again");
      }
      const hashedPassword = await bcrypt.hash(args.newPassword, 12);

      await user.updateOne({
        $set: {
          password: hashedPassword,
        },
      });

      return "Password changed";
    } catch (error) {
      throw error;
    }
  },
};
