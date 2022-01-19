const mongoose = require("mongoose");
const objId = mongoose.Types.ObjectId;
const loadSchema = mongoose.Schema({
  created_by: { type: objId, required: true },
  assigned_to: { type: objId, default: null },
  __v: { type: Number, select: false },
  status: {
    type: String,
    enum: ["NEW", "POSTED", "ASSIGNED", "SHIPPED"],
    default: "NEW",
  },
  state: {
    type: String,
    enum: [
      "En route to Pick Up",
      "Arrived to Pick Up",
      "En route to delivery",
      "Arrived to delivery",
    ],
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },

  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    height: { type: Number, required: true },
  },

  logs: [
    {
      type: {
        message: { type: String },
        time: { type: Date, default: Date.now() },
      },
    },
  ],
  created_date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Load", loadSchema);
