module.exports = rolesMiddleware = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      // const myErr = new Error(`only ${role} is allowed to to this action`);
      // myErr.status = 400;
      // throw myErr;

      return res
        .status(400)
        .json({ message: `only ${role} is allowed to to this action` });
    }
    next();
  };
};
