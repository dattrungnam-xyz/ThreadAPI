import express from "express";

import { authController } from "../controllers/authController.js";
import { commentController } from "../controllers/commentController.js";

const router = express.Router();


router.post('/:idPost',authController.protect,commentController.createComment)
router.patch(
  "/:idComment",
  authController.protect,
  commentController.updateComment
);
router.delete(
  "/:idComment",
  authController.protect,
  commentController.deleteComment
);

export default router;
