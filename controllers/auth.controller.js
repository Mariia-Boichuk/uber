const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const Joi = require("joi");
const checkData = require("../validation/UserValidation");

class Auth {
  loginUser = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const myErr = new Error("user does not exist");
      myErr.status = 400;
      throw myErr;
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      const myErr = new Error("password is not correct");
      myErr.status = 400;
      throw myErr;
    }

    const jwt_token = jsonwebtoken.sign(
      { email, _id: userExists._id },
      process.env.SECRET_FOR_JWT,
      {
        expiresIn: "65h",
      }
    );

    res.json({ jwt_token });
  };

  registerUser = async (req, res) => {
    const { email, role, password } = req.body;
    const { error } = checkData({ email, role, password });
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      const myErr = new Error("user already exists");
      myErr.status = 400;
      throw myErr;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      role,
      password: hashedPassword,
    };

    await User.create(user);
    res.json({ message: "user created successfully" });
  };
}

module.exports = new Auth();
