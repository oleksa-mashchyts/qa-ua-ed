const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: Array,
    default: [],
  },
  courseId: {
    // Додаємо поле для зв'язку з курсом
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Test", TestSchema);
