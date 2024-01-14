import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import multer from "multer";

import { AppError } from "../utils/appError.js";
import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import {
  uploadPhotoCloudinary,
  uploadVideoCloudinary,
} from "../utils/uploadCloudinary.js";
import { filterImageAndVideo } from "../utils/multerFilter.js";

dotenv.config();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: filterImageAndVideo,
});

let postController = {
  uploadPostMedia: upload.array("files", 10),
  createPost: async function (req, res, next) {
    req.body.authorPost = req.user.id;
    let files = req.files;
    if (files) {
      let multiPromise = files.map((file) => {
        if (file.mimetype.startsWith("image")) {
          return uploadPhotoCloudinary(file);
        } else if (file.mimetype.startsWith("video")) {
          return uploadVideoCloudinary(file);
        }
      });
      req.body.media = await Promise.all(multiPromise);
    }
    const post = await Post.create(req.body);
    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  },
  updatePost: async function (req, res, next) {
    let post = await Post.findById(req.params.idPost);
    // let post = await Post.findById("65a2a98211e9a8fa71adb999");
    if (!post) {
      return next(new AppError("No post found with that ID", 404));
    }
    if (post.authorPost != req.user.id) {
      return next(
        new AppError("You don't have permission to edit this post.", 400)
      );
    }
    //index of Image

    if (req.body.deleteMedia) {
      req.body.deleteMedia = req.body.deleteMedia.sort((a, b) => b - a);
      req.body.deleteMedia.forEach((index) => {
        post.media.splice(index, 1);
      });
    }
    if (req.files) {
      let multiPromise = files.map((file) => {
        if (file.mimetype.startsWith("image")) {
          return uploadPhotoCloudinary(file);
        } else if (file.mimetype.startsWith("video")) {
          return uploadVideoCloudinary(file);
        }
      });
      let updateMedia = await Promise.all(multiPromise);
      post.media = post.media.concat(updateMedia);
    }

    for (let [key, value] of Object.entries(req.body)) {
      if (key != "deleteMedia" && key != "files") {
        post[key] = value;
      }
    }

    await post.save();

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  },
  deletePost: async function (req, res, next) {
    let post = await Post.findById(req.params.idPost);
    if (!post) {
      return next(new AppError("No post found with that ID", 404));
    }
    if (post.authorPost != req.user.id) {
      return next(
        new AppError("You don't have permission to edit this post.", 400)
      );
    }

    const doc = await Post.findByIdAndDelete(req.params.idPost);
    await Comment.deleteMany({
      postId: req.params.idPost,
    });
    res.status(204).json({
      status: "success",
      data: null,
    });
  },
  likePost: async function (req, res, next) {
    let post = await Post.findById(req.params.idPost);
    if (!post) {
      return next(new AppError("No post found with that ID", 404));
    }
    let index = post.like.indexOf(req.user.id);
    if (index != -1) {
      return next(new AppError("Your account already like this post.", 400));
    }
    post.like.push(req.user.id);
    post.save();
    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  },
  unlikePost: async function (req, res, next) {
    let post = await Post.findById(req.params.idPost);
    if (!post) {
      return next(new AppError("No post found with that ID", 404));
    }
    let index = post.like.indexOf(req.user.id);
    if (index == -1) {
      return next(
        new AppError("Your account haven't like this post yet.", 400)
      );
    }
    post.like.splice(index, 1);
    post.save();
    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }
};

export { postController };
