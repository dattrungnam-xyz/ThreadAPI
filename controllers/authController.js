import jwt from "jsonwebtoken";
import crypto from "crypto";

import { User } from "../models/userModel.js";
import { AppError } from "../utils/appError.js";

let authController = {
  signToken: function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },
  decodeToken: function (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
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

  protect: async function (req, res, next) {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    let token = req.headers.authorization.split(" ")[1];

    const decoded = authController.decodeToken(token);
    // console.log(decoded);

    let user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    if (await user.passwordChangedAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    req.user = user;
    next();
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

      user.password = undefined;

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

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("Incorrect email or password"), 401);
    }

    authController.createAndSendToken(user, 201, req, res);
  },
  updatePassword: async function (req, res, next) {
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let passwordConfirm = req.body.passwordConfirm;

    let user = await User.findById(req.user.id).select("+password");
    if (!(await user.comparePassword(password, user.password))) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    authController.createAndSendToken(user, 200, req, res);
  },
  forgotPassword: async function (req, res, next) {
    let user = await User.findById(req.body.email);
    if (!user) {
      return next(new AppError("There is no user with email address.", 400));
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.save({ validateBeforeSave: false });
    // send Email (reset Token)

  },
  resetPassword: async function (req, res, next) {
    let resetToken = req.params.resetToken 
    let hashedToken = crypto.createHash("sha256")
      .update(resetToken)
      .digest("hex");

    let user = await User.find({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if(!user)
    {
      return next(new AppError("Token is invalid or has expired"),400);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

  },
};

export { authController };
