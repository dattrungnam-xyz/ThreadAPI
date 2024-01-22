import { handleFactory } from "./handleFactory.js";
import { Notification } from "../models/notificationModel.js";
let notificationController = {
  createNotification: handleFactory.createOne(Notification),
  updateNotification: handleFactory.updateOne(Notification),
  getAllNotification: handleFactory.getAll(Notification, {
    path: "idUserSend",
    select: "_id name avatar",
  }),
};
export { notificationController };
