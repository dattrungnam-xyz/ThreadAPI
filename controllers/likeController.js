import { Like } from "../models/likeModel.js";
import { handleFactory } from "./handleFactory.js";

let likeController = {
  like: handleFactory.createOne(Like),
  unlike: handleFactory.deleteOne(Like),
  setIdUser: (req, res, next) => {
    req.body.idUser = req.user.id;
    next();
  },
};
export { likeController };
