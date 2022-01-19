const Joi = require("@hapi/joi");
const checkPasswords = (data) => {
  const passwordSchema = Joi.object({
    newPassword: Joi.string()
      .required()
      .min(4)
      .pattern(/^[a-zA-Z0-9]{3,30}$/),
    oldPassword: Joi.string().required().min(4),
  });

  return passwordSchema.validate(data);
};

module.exports = checkPasswords;
