const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        questionText: String,
        options: [String],
        correctOption: Number
    }],
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);

