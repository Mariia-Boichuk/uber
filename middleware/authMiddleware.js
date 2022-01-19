const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      const myErr = new Error("no token");
      myErr.status = 400;
      throw myErr;
    }

    const payload = await jsonwebtoken.verify(
      token,
      process.env.SECRET_FOR_JWT
    );
    req.user = await User.findOne({ email: payload.email });

    if (!req.user) {
      const myErr = new Error("user was not found");
      myErr.status = 400;
      throw myErr;
    }
    next();
  } catch (error) {
    error.status = 400;
    console.log(error);
    next(error);
  }
};
