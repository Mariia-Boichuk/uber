const express = require("express");
const authController = require("../controllers/auth.controller");
const asyncWrapper = require("../utils/async.wrapper");
const myrouter = express.Router();
myrouter.post("/login", asyncWrapper(authController.loginUser));
myrouter.post("/register", asyncWrapper(authController.registerUser));
module.exports = myrouter;
