import { User } from "../models/userModel.js";
import { AppError } from "../utils/appError.js";
import  jwt from "jsonwebtoken";

let authController = {
  signToken: function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },
  createAndSendToken: function (user, status, req, res) {
    let token = authController.signToken(user.id);
    user.password = undefined;
    return res.status(status).json({
      status: "success",
      token,
      data: {
        data: user,
      },
    });
  },
  signUp: async function (req, res, next) {
    try {
      let user = await User.create({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        passwordConfirm: req.body.passwordConfirm,
      });

      return res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
  logIn: async function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    const user = await User.findOne({ email: email }).select("+password");

    if (!user ||  ! (await user.comparePassword(password, user.password))) {
      return next(new AppError("Incorrect email or password"), 401);
    }

    authController.createAndSendToken(user, 201, req, res);
  },
};

export { authController };
