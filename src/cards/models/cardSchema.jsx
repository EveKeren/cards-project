import Joi from "joi";

const url = Joi.string()
  .uri({ scheme: [/https?/] })
  .min(14);
const phoneIL = /^0\d{8,10}$/;

const cardSchema = {
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string()
    .pattern(phoneIL)
    .required()
    .messages({
      "string.pattern.base": "Phone must be Israeli (0 + 8–10 digits)",
    }),
  email: Joi.string().email({ tlds: false }).required(),
  web: url.allow(""),
  imageUrl: url.required(),
  imageAlt: Joi.string().min(2).max(256).required(),
  state: Joi.string().allow("").max(256),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.alternatives().try(
    Joi.number().integer().min(1),
    Joi.string()
  ),
  zip: Joi.alternatives().try(Joi.number().integer(), Joi.string()),
};
export default cardSchema;
