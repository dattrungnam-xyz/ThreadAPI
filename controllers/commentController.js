import { Comment } from "../models/commentModel.js";
import { handleFactory } from "./handleFactory.js";

let commentController = {
  createComment: handleFactory.createOne(Comment),
  updateComment: handleFactory.updateOne(Comment),
  deleteComment: handleFactory.deleteOne(Comment),
  setIdUser: (req, res, next) => {
    req.body.idUser = req.user.id;
    next();
  },
};

export { commentController };
