const User = require("../models/User");
const bcrypt = require("bcrypt");
const checkPasswords = require("../validation/PasswordValidation");

class UserCont {
  getMyInfo = async (req, res) => {
    const { _id, role, created_date, email } = req.user;
    res.status(200).json({ user: { _id, email, role, created_date } });
  };

  deleteMyProfile = async (req, res) => {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Profile deleted successfully" });
  };

  updatePassword = async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    const { error } = checkPasswords(req.body);
    if (error) {
      const myErr = new Error(error);
      myErr.status = 400;
      throw myErr;
    }
    const isOldPassValid = await bcrypt.compare(oldPassword, req.user.password);
    if (!isOldPassValid) {
      const myErr = new Error("old password is wrong");
      myErr.status = 400;
      throw myErr;
    }

    const hashedNewPass = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, {
      password: hashedNewPass,
    });

    res.status(200).json({
      message: "Password changed successfully",
    });
  };
}

module.exports = new UserCont();
