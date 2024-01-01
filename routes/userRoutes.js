import express from "express";
import { authController } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);


router.patch("/updatePassword",authController.protect, authController.updatePassword);
export default router;
