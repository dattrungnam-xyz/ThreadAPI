import mongoose from "mongoose";
import validator from "validator";

const likeSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Id user can not be empty."],
  },
  idPost: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  idComment: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
  },
});

const Like = mongoose.model("Like", likeSchema);

export { Like };
