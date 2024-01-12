import mongoose from "mongoose";
import validator from "validator";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  authorComment: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  content: {
    type: String,
  },
  media: [
    {
      type: String,
    },
  ],
  like: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  likeCount: Number,
});

commentSchema.post(/^find/, function (doc) {
  doc.likeCount = doc.like?.length || 0;
 
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
