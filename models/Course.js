const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // тривалість в годинах
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson' // посилання на модель Lesson
  }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
