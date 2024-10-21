const Joi = require('joi');

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
});

module.exports = courseSchema;
