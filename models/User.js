const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  role: { type: String, enum: ["DRIVER", "SHIPPER"] },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  __v: { type: Number, select: false },
  created_date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("User", UserSchema);
