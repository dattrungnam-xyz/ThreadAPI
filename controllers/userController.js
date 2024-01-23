import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();

import { User } from "../models/userModel.js";

import { AppError } from "../utils/appError.js";

import { filterImage } from "../utils/multerFilter.js";
import { catchError } from "../utils/catchError.js";
import { mediaController } from "./mediaController.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: filterImage,
});

let userController = {
  uploadUserPhoto: upload.single("avatar"),

  filterBody: function (obj, ...excludeField) {
    Object.keys(obj).forEach((field) => {
      if (excludeField.includes(field)) {
        delete obj[field];
      }
    });
  },
  getUserProfile: catchError(async function (req, res, next) {
    let user = await User.findById(req.params.id)
      .populate("followers")
      .populate("following")
      .populate("followingRequest")
      .populate("followerRequest");

    if (req.user.id == req.params.id) {
      return res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    }
    user.followerRequest = undefined;
    user.followingRequest = undefined;
    user.passwordChangedAt = undefined;
    // if acc private and current user dont follow this user => filter user infor
    if (user.private && !user.followers.includes(req.user.id)) {
      user.email = undefined;
      user.following = undefined;
      user.followers = undefined;
    }
    return res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  }),

  updateProfile: catchError(async function (req, res, next) {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }
    if (req.file) {
      let mediaId = await mediaController.createOne(req.file);
      req.body.avatar = mediaId;
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
        user: user,
      },
    });
  }),
  setPrivate: catchError(async function (req, res, next) {
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
  }),
  follow: catchError(async function (req, res, next) {
    let userRequest = await User.findById(req.user.id);
    let userFollow = await User.findById(req.params.id);

    let indexOfUserFollow = userRequest.following.indexOf(req.params.id);
    let indexOfUserRequest = userFollow.followers.indexOf(req.user.id);

    if (indexOfUserFollow != -1 || indexOfUserRequest != -1) {
      return next(new AppError("Your account already follow this user!", 400));
    }

    //public
    if (!userFollow.private) {
      userRequest.following.push(req.params.id);

      userFollow.followers.push(req.user.id);
    } else {
      userRequest.followingRequest.push(req.params.id);

      userFollow.followerRequest.push(req.user.id);
    }
    await userRequest.save({ validateBeforeSave: false });
    await userFollow.save({ validateBeforeSave: false });

    userRequest = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      data: {
        user: userRequest,
      },
    });
  }),

  unfollow: catchError(async function (req, res, next) {
    let userCurrent = await User.findById(req.user.id);
    let userUnfollow = await User.findById(req.params.id);

    let indexOfUserCurrent = userUnfollow.followers.indexOf(req.user.id);
    let indexOfUserUnfollow = userCurrent.following.indexOf(req.params.id);

    if (indexOfUserCurrent === -1 || indexOfUserUnfollow === -1) {
      return next(
        new AppError("Your account haven't follow this user yet!", 400)
      );
    }

    userCurrent.following.splice(indexOfUserUnfollow, 1);
    userUnfollow.followers.splice(indexOfUserCurrent, 1);

    await userCurrent.save({ validateBeforeSave: false });
    await userUnfollow.save({ validateBeforeSave: false });

    userCurrent = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      data: {
        user: userCurrent,
      },
    });
  }),
  removeFollower: catchError(async function (req, res, next) {
    let userCurrent = await User.findById(req.user.id);
    let userRemove = await User.findById(req.params.id);

    let indexOfUserCurrent = userRemove.following.indexOf(req.user.id);
    let indexOfUserRemove = userCurrent.followers.indexOf(req.params.id);

    if (indexOfUserCurrent === -1 || indexOfUserRemove === -1) {
      return next(new AppError("This account haven't follow you yet!", 400));
    }

    userCurrent.followers.splice(indexOfUserRemove, 1);
    userRemove.following.splice(indexOfUserCurrent, 1);

    await userCurrent.save({ validateBeforeSave: false });
    await userRemove.save({ validateBeforeSave: false });

    userCurrent = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      data: {
        user: userCurrent,
      },
    });
  }),
  handleRequestFollow: catchError(async function (req, res, next) {
    let currentUser = await User.findById(req.user.id);
    let userRequest = await User.findById(req.params.id);

    let indexOfUserRequest = currentUser.followerRequest.indexOf(req.params.id);
    let indexOfCurrentUser = userRequest.followingRequest.indexOf(req.user.id);

    if (indexOfUserRequest == -1 || indexOfCurrentUser == -1) {
      return next(
        new AppError(
          "This user does't request or already follow your account!",
          400
        )
      );
    }

    currentUser.followerRequest.splice(indexOfUserRequest, 1);
    userRequest.followingRequest.splice(indexOfCurrentUser, 1);

    let decision = req.body.decision;

    // if approved, add to follower and following
    if (decision) {
      currentUser.followers.push(req.params.id);
      userRequest.following.push(req.user.id);
    }

    await currentUser.save({ validateBeforeSave: false });
    await userRequest.save({ validateBeforeSave: false });

    currentUser = await User.findById(req.user.id);

    return res.status(200).json({
      status: "success",
      data: {
        user: currentUser,
      },
    });
  }),
  getUser: async function (req, res, next) {
    let userCurrent = await User.findById(req.params.id)
      .populate({
        path: "followers",
        select: " id avatar name",
      })
      .populate({
        path: "following",
        select: " id avatar name",
      })
      .populate({
        path: "followingRequest",
        select: " id avatar name",
      })
      .populate({
        path: "followerRequest",
        select: " id avatar name",
      });

    return res.status(200).json({
      status: "success",
      data: {
        user: userCurrent,
      },
    });
  },
};

export { userController };
