import express from "express";
import { authController } from "../controllers/authController.js";
import { postController } from "../controllers/postController.js";


const router = express.Router();

router.post("/",authController.protect, postController.uploadPostMedia, postController.createPost);
router.patch(
  "/updatePost/:idPost",
  authController.protect,
  postController.uploadPostMedia,
  postController.updatePost
);
router.post("/1",postController.updatePost);

export default router;
