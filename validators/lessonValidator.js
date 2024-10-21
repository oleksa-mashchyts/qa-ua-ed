const Joi = require('joi');

const validateLesson = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().required(),
    duration: Joi.number().required(),  // Тривалість у хвилинах
    course: Joi.string().required(),  // ID курсу, до якого належить урок
  });

  return schema.validate(data);
};

module.exports = {
  validateLesson,
};
