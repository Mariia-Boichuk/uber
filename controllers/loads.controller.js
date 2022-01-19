const res = require("express/lib/response");
const mongoose = require("mongoose");
const Load = require("../models/Load");
const Truck = require("../models/Truck");
const User = require("../models/User");
const {
  loadStatesList,
  dimensionsObject: dimensionsObj,
  getRandomTruck,
} = require("../utils/constants");
const loadValidationSchema = require("../validation/loadValidation");

class LoadCont {
  addLoadForUser = async (req, res) => {
    const { error } = loadValidationSchema.validate(req.body);
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const newLoad = { ...req.body, created_by: req.user._id };
    await Load.create(newLoad);
    res.status(200).json({
      message: "Load created successfully",
    });
  };

  getListOfLoads = async (req, res) => {
    let loads;
    const status = req.query.status;
    if (req.user.role === "DRIVER") {
      //logic for loads must me assigned to current driver
      loads = await Load.find({
        assigned_to: req.user._id,
      });
    }
    //all shipper's loads
    if (req.user.role === "SHIPPER") {
      loads = await Load.find({
        created_by: req.user._id,
        // status: { $ne: "SHIPPED" },
      });
    }
    if (!loads) {
      const myErr = new Error("no loads for authorized driver");
      myErr.status = 400;
      throw myErr;
    }
    if (req.query.status) {
      loads = loads.filter((item) => item.status === req.query.status);
    }
    res.status(200).json({ loads });
  };

  getUsersActiveLoad = async (req, res) => {
    //only for drivers
    let load = await Load.findOne({
      assigned_to: req.user._id,
      status: "ASSIGNED",
    });
    if (!load) {
      load = {};
    }
    res.status(200).json({ load });
  };

  iterateNextLoadsState = async (req, res) => {
    //only for drivers
    const load = await Load.findOne({
      assigned_to: req.user._id,
      status: { $ne: "SHIPPED" },
    });

    if (!load) {
      const myErr = new Error(" no active load for authorized driver");
      myErr.status = 400;
      throw myErr;
    }
    const index = loadStatesList.indexOf(load.state) + 1;
    console.log(load.state, "index", index);
    //if status is arrived to delivery
    if (index === 3) {
      const newState = loadStatesList[index] ?? loadStatesList[0];
      await load.updateOne({ status: "SHIPPED", state: newState });
      await Truck.findOneAndUpdate(
        { assigned_to: req.user._id },
        { status: "IS" }
      );
    }
    if (index === 4) {
      return res.status(200).json({
        message: `Load state is  '${load.state}'`,
      });
    } else {
      const newState = loadStatesList[index];
      await load.updateOne({ state: newState });
      return res.status(200).json({
        message: `Load state changed to '${newState}'`,
      });
    }
  };

  getUsersLoadById = async (req, res) => {
    //role?
    const load = await Load.findById(req.params.id);

    if (!load) {
      const myErr = new Error("load does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }
    console.log("compare", load.created_by, req.user._id);
    if (
      load.created_by.toString() !== req.user._id.toString() &&
      load.assigned_to.toString() !== req.user._id.toString()
    ) {
      const myErr = new Error("load does not belong to current user");
      myErr.status = 400;
      throw myErr;
    }
    res.status(200).json({ load });
  };

  updateUsersLoadById = async (req, res) => {
    //only for shippers / allow fow fieleds in body
    const { error } = loadValidationSchema.validate(req.body);
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const load = await Load.findById(req.params.id);

    if (!load) {
      const myErr = new Error("load does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }
    console.log("compare", load.created_by, req.user._id);
    if (load.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("load does not belong to current user");
      myErr.status = 400;
      throw myErr;
    }

    if (load.status !== "NEW") {
      const myErr = new Error("you can update only loads with status new");
      myErr.status = 400;
      throw myErr;
    }
    await load.updateOne(req.body, {
      runValidators: true,
    });

    res.status(200).json({ message: "Load details changed successfully" });
  };

  deleteUsersLoadById = async (req, res) => {
    //only for shippers
    const load = await Load.findById(req.params.id);

    if (!load) {
      const myErr = new Error("load does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }
    console.log("compare", load.created_by, req.user._id);
    if (load.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("load does not belong to current user (shipper)");
      myErr.status = 400;
      throw myErr;
    }

    if (load.status !== "NEW") {
      const myErr = new Error("you can delete only loads with status new");
      myErr.status = 400;
      throw myErr;
    }
    await load.deleteOne();

    res.status(200).json({ message: "Load deleted successfully" });
  };

  //search for trucks only for shippers role

  postLoadFindDriver = async (req, res) => {
    //find load

    let load = await Load.findById(req.params.id);

    if (!load) {
      const myErr = new Error("load does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }

    if (load.status !== "NEW") {
      const myErr = new Error("you can post only loads with status new");
      myErr.status = 400;
      throw myErr;
    }

    console.log("compare", load.created_by, req.user._id);
    if (load.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("load does not belong to current user (shipper)");
      myErr.status = 400;
      throw myErr;
    }

    //change status from new to posted
    await load.updateOne({ status: "POSTED" });

    //finding appropriate truck...
    const suitableTrucks = await Truck.find({
      assigned_to: { $ne: null },
      status: "IS",
    });

    const suitableTrucksByDimensions = suitableTrucks.filter((item) => {
      return (
        dimensionsObj[item.type].payload >= load.payload &&
        dimensionsObj[item.type].width >= load.dimensions.width &&
        dimensionsObj[item.type].height >= load.dimensions.height &&
        dimensionsObj[item.type].length >= load.dimensions.length
      );
    });
    //no suitable trucks found:
    if (suitableTrucks.length === 0) {
      await load.updateOne({
        status: "NEW",
        $push: {
          logs: {
            message: `no free trucks for load: ${load.name} found`,
            time: Date.now(),
          },
        },
      });
      const myErr = new Error("no free trucks found");
      myErr.status = 400;
      throw myErr;
    }

    if (suitableTrucksByDimensions.length === 0) {
      await load.updateOne({
        status: "NEW",
        $push: {
          logs: {
            message: `no suitable trucks by dimensions for load from  ${suitableTrucks.length} trucks found`,
            time: Date.now(),
          },
        },
      });
      const myErr = new Error(
        `no suitable trucks by dimensions for load from  ${suitableTrucks.length} trucks found`
      );
      myErr.status = 400;
      throw myErr;
    }

    //choosing random truck
    const randomTruck = getRandomTruck(suitableTrucks);

    //checking truck's driver... and updating his info
    const driver = User.findById(randomTruck.assigned_to);
    if (!driver) {
      await load.updateOne({
        status: "NEW",
        logs: {
          message: `with id ${randomTruck.assigned_to} no longer exists in a system`,
          time: Date.now(),
        },
      });
      const myErr = new Error("driver no longer exist in a system");
      myErr.status = 400;
      throw myErr;
    }

    //truck found
    await randomTruck.updateOne({ status: "OL" });

    await load.updateOne({
      status: "ASSIGNED",
      assigned_to: randomTruck.assigned_to,
      state: "En route to Pick Up",
      $push: {
        logs: {
          message: `found truck id: ${randomTruck._id}, driver id:${randomTruck.assigned_to},  for load ${load.name}`,
          time: Date.now(),
        },
      },
    });
    res
      .status(200)
      // .json({ load, suitableTrucks, suitableTrucksByDimensions, randomTruck });
      .json({
        message: "Load posted successfully",
        driver_found: true,
      });
  };

  getShippingInfo = async (req, res) => {
    //only for shippers
    let load = await Load.findById(req.params.id);

    if (!load) {
      const myErr = new Error("load does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }

    if (load.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("load does not belong to current user");
      myErr.status = 400;
      throw myErr;
    }

    let truck;
    if (load.assigned_to === null) {
      truck = {};
    } else {
      truck = await Truck.findOne({ assigned_to: load.assigned_to });
    }

    return res.status(200).json({ load, truck });
  };
}

module.exports = new LoadCont();
