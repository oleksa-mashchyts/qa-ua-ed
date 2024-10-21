const Joi = require('joi');

// Валідація для тесту
const testValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        questions: Joi.array().items(Joi.object({
            question: Joi.string().required(),
            options: Joi.array().items(Joi.string()).required(),
            answer: Joi.string().required()
        })).min(1).required(),
        lessonId: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = { testValidation };
