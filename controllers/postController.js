import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import multer from "multer";

import { mediaController } from "./mediaController.js";

import { AppError } from "../utils/appError.js";
import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";

import { catchError } from "../utils/catchError.js";
import { filterImageAndVideo } from "../utils/multerFilter.js";

dotenv.config();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: filterImageAndVideo,
});

let postController = {
  uploadPostMedia: upload.array("files", 10),
  createPost: catchError(async function (req, res, next) {
    req.body.authorPost = req.user.id;
    let files = req.files;
    if (files) {
      req.body.media = await mediaController.createMany(files);
    }
    const post = await Post.create(req.body);
    return res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  }),
  updatePost: catchError(async function (req, res, next) {
    let post = await Post.findById(req.params.id);
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
      req.body.deleteMedia.forEach((mediaId) => {
        let index = post.media.indexOf(mediaId);
        post.media.splice(index, 1);
      });
    }
    if (req.files) {
      let listUpdateMediaId = await mediaController.createMany(req.files);
      post.media = post.media.concat(listUpdateMediaId);
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
  }),
  deletePost: catchError(async function (req, res, next) {
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
  }),
  getPost: catchError(async function (req, res, next) {
    let post = await Post.findById(req.params.id)
      .populate({
        path: "like",
        select: "-__v ",
        populate: {
          path: "idUser",
          select: "_id name avatar",
        },
      })
      .populate({
        path: "comments",
        select: "-__v",
        populate: {
          path: "idUser",
          select: "_id name avatar",
        },
      });
    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }),
};

export { postController };
