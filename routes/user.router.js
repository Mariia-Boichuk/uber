const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleWare = require("../middleware/authMiddleWare");
const asyncWrapper = require("../utils/async.wrapper");
const userRouter = express.Router();

userRouter.get("/", asyncWrapper(userController.getMyInfo));
userRouter.delete(
  "/",
  asyncWrapper(rolesMiddleware("SHIPPER")),
  asyncWrapper(userController.deleteMyProfile)
);
userRouter.patch("/password", asyncWrapper(userController.updatePassword));

module.exports = userRouter;
