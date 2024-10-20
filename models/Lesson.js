const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Тут можна зберігати текст уроку або посилання на файл
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Зв'язок з курсом
});

module.exports = mongoose.model('Lesson', lessonSchema);
