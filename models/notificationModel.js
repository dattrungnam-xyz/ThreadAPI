import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  idUserSend: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "ID user send can not be empty."],
  },
  idUserReceive: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "ID user receive can not be empty."],
  },
  type: {
    type: String,
    enum: [
      "requestFollow",
      "acceptFollow",
      "follow",
      "mention",
      "alert",
      "like",
      "comment",
      "repost",
    ],
    default: "follow",
  },
  message: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
