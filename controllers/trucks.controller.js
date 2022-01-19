const Joi = require("joi");
const Truck = require("../models/Truck");
const truckValidationSchema = require("../validation/truckValidation");

class TrucksCont {
  addTruckForUser = async (req, res) => {
    const { type } = req.body;
    const { error } = truckValidationSchema.validate({ type });
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const newTruck = {
      type,
      created_by: req.user._id,
    };
    await Truck.create(newTruck);
    res.status(200).json({
      message: "Truck created successfully",
    });
  };

  getUsersTrucks = async (req, res) => {
    const trucks = await Truck.find({ created_by: req.user._id });
    res.status(200).json({ trucks });
  };

  getUsersTruckById = async (req, res) => {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
      const myErr = new Error("truck does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }
    if (truck.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("truck does not belong to current user");
      myErr.status = 400;
      throw myErr;
    }
    res.status(200).json({ truck });
  };

  updateUsersTruckById = async (req, res) => {
    const { type } = req.body;
    const { error } = truckValidationSchema.validate({ type });
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { type },
      { runValidators: true }
    );

    if (!truck) {
      const myErr = new Error("truck does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }

    // if (truck.created_by.toString() !== req.user._id.toString()) {
    //   const myErr = new Error("truck does not belong to current user");
    //   myErr.status = 400;
    //   throw myErr;
    // }

    res.status(200).json({ message: "Truck details changed successfully" });
  };

  deleteUsersTruck = async (req, res) => {
    const truck = await Truck.findByIdAndDelete(req.params.id);

    if (!truck) {
      const myErr = new Error("truck does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }

    // if (truck.created_by.toString() !== req.user._id.toString()) {
    //   const myErr = new Error("truck does not belong to current user");
    //   myErr.status = 400;
    //   throw myErr;
    // }

    res.status(200).json({ message: "Truck deleted successfully" });
  };

  assignTruck = async (req, res) => {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
      const myErr = new Error("truck does not with such id does not exist");
      myErr.status = 400;
      throw myErr;
    }
    if (truck.created_by.toString() !== req.user._id.toString()) {
      const myErr = new Error("truck does not belong to current driver");
      myErr.status = 400;
      throw myErr;
    }

    if (truck.assigned_to !== null) {
      const myErr = new Error(
        `this truck already has assigned driver with id ${truck.assigned_to}`
      );
      myErr.status = 400;
      throw myErr;
    }
    const truckWithThisDriver = await Truck.findOne({
      assigned_to: req.user.id,
    });
    if (truckWithThisDriver) {
      const myErr = new Error(
        `you (driver ${req.user.email}) already have truck(id: ${truckWithThisDriver._id}) assigned to you`
      );
      myErr.status = 400;
      throw myErr;
    }

    await truck.updateOne({ assigned_to: req.user.id });
    res.status(200).json({ message: "Truck assigned successfully" });
  };
}

module.exports = new TrucksCont();
