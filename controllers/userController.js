import { User } from "../models/userModel.js";
import { AppError } from "../utils/appError.js";

let userController = {
  filterBody: function (obj, ...excludeField) {
    Object.keys(obj).forEach((field) => {
      if (excludeField.includes(field)) {
        delete obj[field];
      }
    });
  },
  editProfile: async function (req, res, next) {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    userController.filterBody(
      req.body,
      "password",
      "email",
      "passwordConfirm",
      "active",
      "followers",
      "following",
      "private"
    );

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  },
  updatePrivateAccount: async function (req, res, next) {
    let privateAccount = req.body.privateAccount;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { private: privateAccount },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
  follow: async function (req, res, next) {
    let user = await User.findById(req.user.id);
    let index = user.following.indexOf(req.body.idUser);
    if (index != -1) {
      return next(new AppError("Your account already follow this user!", 400));
    }

    user.following.push(req.body.idUser);
    await user.save();
    user = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
  unfollow: async function (req, res, next) {
    let user = await User.findById(req.user.id);
    let index = user.following.indexOf(req.body.idUser);
    if (index === -1) {
      return next(
        new AppError("Your account haven't follow this user yet!", 400)
      );
    }

    user.following.splice(index,1);
    await user.save();
    user = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
};

export { userController };
