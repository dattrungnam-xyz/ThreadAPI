import express from "express";
import { authController } from "../controllers/authController.js";
import { postController } from "../controllers/postController.js";

const router = express.Router();

router.post(
  "/",
  authController.protect,
  postController.uploadPostMedia,
  postController.createPost
);

router.get("/:id", postController.getPost);
router.patch(
  "/updatePost/:id",
  authController.protect,
  postController.uploadPostMedia,
  postController.updatePost
);


export default router;
