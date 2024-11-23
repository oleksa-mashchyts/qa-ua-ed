const mongoose = require('mongoose');
const { isInt, isLength } = require('validator'); // Імпортуємо validator

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isLength(value, { min: 1, max: 100 }),
      message: "Title must be between 1 and 100 characters long.",
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isLength(value, { min: 1, max: 500 }),
      message: "Description must be between 1 and 500 characters long.",
    },
  },
  duration: {
    type: Number, // тривалість в годинах
    required: true,
    validate: {
      validator: (value) => Number.isInteger(value) && value > 0, // Валідація на позитивне ціле число
      message: "Duration must be a positive integer.",
    },
    /*validate: {
      validator: (value) => isInt(value, { min: 1 }), // Стара валідація, яка очікувала рядок, а не число
      message: 'Duration must be a positive integer.',
    },*/
  },
  level: {
    type: String,
    enum: ["novice", "intermediate", "advanced", "expert", "not defined"], // Доступні рівні
    default: "not defined",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    default: "", // Початкове значення порожнє
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson", // посилання на модель Lesson
    },
  ],
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill", // Зв'язок з моделлю Skill
    },
  ],
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
