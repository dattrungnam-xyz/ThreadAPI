import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  idPost: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  idUser: {
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
  likeCount: Number,
});

commentSchema.virtual("like", {
  ref: "Like",
  foreignField: "idComment",
  localField: "_id",
});
commentSchema.post(/^find/, function (doc) {
  doc.likeCount = doc.like?.length || 0;
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
