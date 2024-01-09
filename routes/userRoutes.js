import express from "express";
import { authController } from "../controllers/authController.js";
import { userController } from "../controllers/userController.js";

const router = express.Router();

// test route
router.get("/getUser/:id", userController.getUser);
// end test route



router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);



router.get(
  "/profile/:id",
  authController.protect,
  userController.getUserProfile
);



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
