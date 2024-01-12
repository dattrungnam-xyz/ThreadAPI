import express from "express";
import { authController } from "../controllers/authController.js";
import { postController } from "../controllers/postController.js";


const router = express.Router();

router.post("/", postController.uploadPostMedia, postController.createPost);

export default router;
