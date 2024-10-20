const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctOption: {
        type: Number,
        required: true,
    },
});

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    questions: [questionSchema], // масив запитань
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
