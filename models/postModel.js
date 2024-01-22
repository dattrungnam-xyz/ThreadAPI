import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
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
    },
    media: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Media",
      },
    ],

    likeCount: Number,
    commentCount: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("like", {
  ref: "Like",
  foreignField: "idPost",
  localField: "_id",
});
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "idPost",
  localField: "_id",
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
