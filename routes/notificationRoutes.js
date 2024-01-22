import express from "express";
import { notificationController } from "../controllers/notificationController.js";
let router = express.Router();

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAllNotification);
export default router;
