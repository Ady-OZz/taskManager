const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    error: {
      message,
      code,
    },
  });
};

module.exports = errorHandler;
