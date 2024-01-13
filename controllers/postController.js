import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import multer from "multer";

import { AppError } from "../utils/appError.js";
import { Post } from "../models/postModel.js";
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
    // let userId = req.user.id;
    let response = [];
    let files = req.files;
    if (files) {
      let multiPromise = files.map((file) => {
        if (file.mimetype.startsWith("image")) {
          return uploadPhotoCloudinary(file);
        } else if (file.mimetype.startsWith("video")) {
          return uploadVideoCloudinary(file);
        }
      });
      response = await Promise.all(multiPromise);
    }
    return res.status(200).json({
      response,
    });
  },
  updatePost: async function (req, res, next) {},
  deletePost: async function (req, res, next) {},
};

export { postController };
