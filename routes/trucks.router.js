const express = require("express");
const trucksController = require("../controllers/trucks.controller");
const rolesMiddleware = require("../middleware/rolesMiddleware");

const asyncWrapper = require("../utils/async.wrapper");
const trucksRouter = express.Router();
trucksRouter.use(asyncWrapper(rolesMiddleware("DRIVER")));
trucksRouter.post("/", asyncWrapper(trucksController.addTruckForUser));
trucksRouter.get("/", asyncWrapper(trucksController.getUsersTrucks));
trucksRouter.get("/:id", asyncWrapper(trucksController.getUsersTruckById));
trucksRouter.put("/:id", asyncWrapper(trucksController.updateUsersTruckById));
trucksRouter.delete("/:id", asyncWrapper(trucksController.deleteUsersTruck));
trucksRouter.post("/:id/assign", asyncWrapper(trucksController.assignTruck));

module.exports = trucksRouter;
