const { load } = require("dotenv");
const Joi = require("joi");
const { loadStatesList } = require("../utils/constants");

const loadValidationSchema = Joi.object({
  name: Joi.string().required().min(3),
  payload: Joi.number().required(),
  pickup_address: Joi.string().required().min(9),
  delivery_address: Joi.string().required().min(9),
  state: Joi.string().valid(...loadStatesList),
  dimensions: Joi.object().keys({
    width: Joi.number().required(),
    length: Joi.number().required(),
    height: Joi.number().required(),
  }),
});

module.exports = loadValidationSchema;
