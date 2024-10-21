const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3, // Мінімальна довжина заголовка
    maxlength: 255, // Максимальна довжина заголовка
  },
  content: {
    type: String,
    required: true,
    minlength: 10, // Мінімальна довжина контенту
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;

