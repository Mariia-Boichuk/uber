const express = require("express");
const LoadCont = require("../controllers/loads.controller");
const rolesMiddleware = require("../middleware/rolesMiddleware");

const asyncWrapper = require("../utils/async.wrapper");
const loadsRouter = express.Router();

loadsRouter.get("/", asyncWrapper(LoadCont.getListOfLoads));
loadsRouter.post(
  "/",
  asyncWrapper(rolesMiddleware("SHIPPER")),
  asyncWrapper(LoadCont.addLoadForUser)
);
loadsRouter.get(
  "/active",
  asyncWrapper(rolesMiddleware("DRIVER")),
  asyncWrapper(LoadCont.getUsersActiveLoad)
);

loadsRouter.patch(
  "/active/state",
  asyncWrapper(rolesMiddleware("DRIVER")),
  asyncWrapper(LoadCont.iterateNextLoadsState)
);
loadsRouter.get("/:id", asyncWrapper(LoadCont.getUsersLoadById));

loadsRouter.use(rolesMiddleware("SHIPPER"));
loadsRouter.delete("/:id", asyncWrapper(LoadCont.deleteUsersLoadById));
loadsRouter.put("/:id", asyncWrapper(LoadCont.updateUsersLoadById));
loadsRouter.post("/:id/post", asyncWrapper(LoadCont.postLoadFindDriver));
loadsRouter.get("/:id/shipping_info", asyncWrapper(LoadCont.getShippingInfo));

module.exports = loadsRouter;
