const errorHandlerMiddleware = (err, req, res, next) => {
  if (err.status && err.message) {
    console.log("customer  errr", err);

    return res.status(err.status).json({ message: err.message });
  }
  console.log("defaut 500 errr", err);
  return res
    .status(500)
    .json({ message: err.message || "Internal server error" });
};

module.exports = errorHandlerMiddleware;
