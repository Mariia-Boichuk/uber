const Joi = require("@hapi/joi");
const checkData = (data) => {
  const userValidSchema = Joi.object({
    email: Joi.string().email().min(4),
    role: Joi.required().valid("SHIPPER", "DRIVER"),
    password: Joi.string()
      .required()
      .min(4)
      .pattern(/^[a-zA-Z0-9]{3,30}$/),
  });

  return userValidSchema.validate(data);
};

module.exports = checkData;
