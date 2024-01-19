import express from "express";

import { authController } from "../controllers/authController.js";
import { commentController } from "../controllers/commentController.js";

const router = express.Router();

router.use(authController.protect, commentController.setIdUser);

router.post("/", commentController.createComment);
router.patch("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;
