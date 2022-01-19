const Joi = require("joi");

const truckValidationSchema = Joi.object({
  type: Joi.string()
    .required()
    .valid("SPRINTER", "SMALL STRAIGHT", "LARGE STRAIGHT"),
});

module.exports = truckValidationSchema;
