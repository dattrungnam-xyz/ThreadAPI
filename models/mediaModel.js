import mongoose from "mongoose";

const mediaModel = new mongoose.Schema({
  type: {
    type: String,
    enum: ["photo", "video"],
    default: "photo",
  },
  url: {
    type: String,
  },
});

const Media = mongoose.model("Media", mediaModel);

export { Media };
