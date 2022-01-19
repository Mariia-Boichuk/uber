const asyncWrapper = (callback) => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    console.log("errorInAsync", error);
    next(error);
  }
};

module.exports = asyncWrapper;
