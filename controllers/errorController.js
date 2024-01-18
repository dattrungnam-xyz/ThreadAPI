let errorController = {
  handleError: function (err, req, res, next) {
    console.log(err);
    err.status = err.status || "Error";
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  },
};
export { errorController };
