import express from "express";
import { authController } from "../controllers/authController.js";
import { userController } from "../controllers/userController.js";

const router = express.Router();

router.get("/getUser/:id", userController.getUser);

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);

router.patch(
  "/updateProfile",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateProfile
);

router.patch("/setPrivate", authController.protect, userController.setPrivate);

router.post("/follow/:id", authController.protect, userController.follow);
router.post("/unfollow/:id", authController.protect, userController.unfollow);
router.post(
  "/removeFollow/:id",
  authController.protect,
  userController.removeFollower
);
router.post(
  "/handleRequest/:id",
  authController.protect,
  userController.handleRequestFollow
);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

export default router;
