const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // посилання на модель Course
    required: true, // обов'язкове поле
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
