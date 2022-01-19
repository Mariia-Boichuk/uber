const mongoose = require("mongoose");

const TruckSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["SPRINTER", "SMALL STRAIGHT", "LARGE STRAIGHT"],
  },
  status: {
    type: String,
    enum: ["IS", "OL"],
    default: "IS",
  },
  __v: { type: Number, select: false },
  created_by: { type: mongoose.Types.ObjectId, required: true },
  assigned_to: { type: mongoose.Types.ObjectId, default: null },
  created_date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Truck", TruckSchema);
