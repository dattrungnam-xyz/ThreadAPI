import mongoose from "mongoose";
import validator from "validator";

const postSchema = new mongoose.Schema({
  authorPost: {
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
      type: mongoose.Schema.ObjectId,
      ref: "Media",
    },
  ],
  like: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  likeCount: Number,
  comment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  commentCount: Number,
});
postSchema.pre(/^find/, function (next) {
  this.populate("media");
  next();
});
postSchema.post(/^find/, function (doc) {
  doc.likeCount = doc.like?.length || 0;
  doc.commentCount = doc.comment?.length || 0;
});

const Post = mongoose.model("Post", postSchema);

export { Post };
