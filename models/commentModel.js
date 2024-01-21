import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  idPost: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "ID post can not be empty."],
  },
  idUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "ID user can not be empty."],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  content: {
    type: String,
    required: [true, "Content can not be empty."],
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
