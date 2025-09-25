import Joi from "joi";

const url = Joi.string()
  .uri({ scheme: [/https?/] })
  .min(10); // Reduced from 14 to 10 to allow shorter URLs like https://a.co

// More flexible phone pattern - allows international formats
// Also accepts Israeli format: 0501234567
const phonePattern = /^(\+?[\d\s\-\(\)]{8,15}|0\d{8,10})$/;

const cardSchema = {
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),

  // ✅ Fixed: More flexible phone validation
  phone: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      "string.pattern.base": "Phone must be 8-15 digits (international formats accepted)",
    }),

  email: Joi.string().email({ tlds: false }).required(),

  // ✅ Fixed: Shorter minimum URL length
  web: url.allow(""),
  imageUrl: url.required(),

  imageAlt: Joi.string().min(2).max(256).required(),
  state: Joi.string().allow("").max(256),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),

  // ✅ Fixed: Allow house number 0 and empty values
  houseNumber: Joi.alternatives().try(
    Joi.number().integer().min(0), // Changed from min(1) to min(0)
    Joi.string().allow("")
  ).allow(""),

  // ✅ Fixed: Allow empty zip codes
  zip: Joi.alternatives().try(
    Joi.number().integer(),
    Joi.string().allow("")
  ).allow(""),
};

export default cardSchema;
