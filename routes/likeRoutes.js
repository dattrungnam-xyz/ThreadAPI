import express from "express";
import { authController } from "../controllers/authController.js";
import { likeController } from "../controllers/likeController.js";

const router = express.Router();

router.use(authController.protect, likeController.setIdUser);
router.post("/", likeController.like);
router.delete("/:id", likeController.unlike);

export default router;
