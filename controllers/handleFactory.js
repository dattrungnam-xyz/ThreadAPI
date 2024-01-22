import { catchError } from "../utils/catchError.js";
import { AppError } from "../utils/appError.js";
import { apiFeatures } from "../utils/apiFeatures.js";

let handleFactory = {
  createOne: (Model) =>
    catchError(async (req, res, next) => {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }),
  updateOne: (Model) =>
    catchError(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }),
  deleteOne: (Model) =>
    catchError(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    }),

  //example :let results = await OrderModel.find().populate([{path: 'user', select: 'firstname'}, {path: 'meal', select: 'name'}]);
  getOne: (Model, popOptions) =>
    catchError(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }),
  getAll: (Model, popOptions = {}) =>
    catchError(async (req, res, next) => {
      let apiFeature = new apiFeatures(Model.find(), req.query)
        .filter()
        .population(popOptions)
        .sort()
        .limitFields()
        .pagination();
      let doc = await apiFeature.query;
      return res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    }),
};
export { handleFactory };
