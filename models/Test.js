const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }], // Можна зберігати масив відповідей
      correctAnswer: { type: String, required: true }, // Правильна відповідь
    },
  ],
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Зв'язок з курсом
});

module.exports = mongoose.model('Test', testSchema);
